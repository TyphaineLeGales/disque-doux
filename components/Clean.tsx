import {
  Canvas,
  Image,
  useImage,
  Path,
  Skia,
  BlendMode,
  SkPath,
  Rect,
  Group,
  PaintStyle,
} from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View, Image as RNImage } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withTiming
} from 'react-native-reanimated';
import Rive, { Fit, RiveRef } from 'rive-react-native';
import { StainPosition } from '../utils/StainPosition';
import { stainConfig } from '../utils/stainConfig';

type CleanProps = {
  onDone: Function;
  id: string;
  debug?: boolean;
};

const { width, height } = Dimensions.get('window');
const RAG_WIDTH = 70;
const BRUSH_SIZE = 50;
const CLEAN_THRESHOLD = 0.5;
const GRID_SIZE = 7;
const STAIN_SIZE = 130;

export default function Clean(props: CleanProps) {
  const { debug = false} = props;
  const [isCleaned, setIsCleaned] = useState(false);
  const [isRagHeld, setIsRagHeld] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [ragRatio, setRagRatio] = useState(1);
  const [grids, setGrids] = useState<boolean[][][]>(
    Array(4).fill(null).map(() => 
      Array(GRID_SIZE).fill(false).map(() => Array(GRID_SIZE).fill(false))
    )
  );
  const [loadedImages, setLoadedImages] = useState<boolean[]>([false, false, false, false]);
  const [currentFaceIdState, setCurrentFaceIdState] = useState(stainConfig.defaultFaceId);
  
  const isMenuMode = useSharedValue(false);
  const touchStartX = useSharedValue(0);
  const touchStartY = useSharedValue(0);
  const pressProgress = useSharedValue(0);
  const currentDirection = useSharedValue(0);
  const currentFaceId = useSharedValue(stainConfig.defaultFaceId);

  // Fonction pour obtenir l'index de la face suivante
  const getNextFaceIndex = useCallback((currentIndex: number, direction: number) => {
    if (direction === 0) return currentIndex;
    const nextIndex = (currentIndex + (direction === 1 ? 1 : -1) + 4) % 4;
    return nextIndex;
  }, []);

  const updateFaceId = useCallback((direction: number) => {
    if (direction === 0) return;
    
    // Mise à jour de la face en fonction de la direction
    let newFaceId = currentFaceId.value;
    if (direction === 1) { // droite
      newFaceId = (currentFaceId.value + 1) % 4;
    } else if (direction === 3) { // gauche
      newFaceId = (currentFaceId.value - 1 + 4) % 4;
    }
    
    currentFaceId.value = newFaceId;
    setCurrentFaceIdState(newFaceId);
    
    // Mise à jour de la face et du solo dans Rive
    riveRef.current?.setInputStateAtPath("FaceId", newFaceId, "Object");
    riveRef.current?.setInputStateAtPath("solo", newFaceId, "Object");
    
    // Réinitialiser la grille pour la nouvelle face
    setGrids(prev => {
      const newGrids = [...prev];
      newGrids[newFaceId] = Array(GRID_SIZE).fill(false).map(() => Array(GRID_SIZE).fill(false));
      return newGrids;
    });
  }, [currentFaceId.value]);

  // Effet pour synchroniser l'état initial
  useEffect(() => {
    currentFaceId.value = stainConfig.defaultFaceId;
    setCurrentFaceIdState(stainConfig.defaultFaceId);
    riveRef.current?.setInputStateAtPath("FaceId", stainConfig.defaultFaceId, "Object");
    // Le solo commence à defaultFaceId
    riveRef.current?.setInputStateAtPath("solo", stainConfig.defaultFaceId, "Object");
  }, [stainConfig.defaultFaceId]);

  const stainImage0 = useImage(require('../assets/images/stains/0.png'), () => {
    setLoadedImages(prev => {
      const newLoaded = [...prev];
      newLoaded[0] = true;
      return newLoaded;
    });
  });
  const stainImage1 = useImage(require('../assets/images/stains/1.png'), () => {
    setLoadedImages(prev => {
      const newLoaded = [...prev];
      newLoaded[1] = true;
      return newLoaded;
    });
  });
  const stainImage2 = useImage(require('../assets/images/stains/2.png'), () => {
    setLoadedImages(prev => {
      const newLoaded = [...prev];
      newLoaded[2] = true;
      return newLoaded;
    });
  });
  const stainImage3 = useImage(require('../assets/images/stains/3.png'), () => {
    setLoadedImages(prev => {
      const newLoaded = [...prev];
      newLoaded[3] = true;
      return newLoaded;
    });
  });

  const stainImages = [stainImage0, stainImage1, stainImage2, stainImage3];

  useEffect(() => {
    if (stainImage0 && stainImage1 && stainImage2 && stainImage3) {
      setLoadedImages(prev => {
        const newLoaded = [...prev];
        newLoaded[0] = true;
        newLoaded[1] = true;
        newLoaded[2] = true;
        newLoaded[3] = true;
        return newLoaded;
      });
    }
  }, [stainImage0, stainImage1, stainImage2, stainImage3]);

  useEffect(() => {
    setCurrentFaceIdState(currentFaceId.value);
  }, [currentFaceId.value]);

  const insets = useSafeAreaInsets();
  const riveRef = useRef<RiveRef>(null);

  useEffect(() => {
    RNImage.getSize(RNImage.resolveAssetSource(require('../assets/rag.png')).uri, 
      (width, height) => {
        setRagRatio(width/height);
      }
    );
  }, []);

  const startX = useSharedValue(width * 0.75 - RAG_WIDTH/2);
  const startY = useSharedValue((height - insets.bottom) * 0.75 - (RAG_WIDTH/ragRatio)/2);
  const translateX = useSharedValue(width * 0.75 - RAG_WIDTH/2);
  const translateY = useSharedValue((height - insets.bottom) * 0.75 - (RAG_WIDTH/ragRatio)/2);
  const cleanPath = useSharedValue<SkPath>(Skia.Path.Make());
  const currentRotation = useSharedValue(0);

  const getRotationAngle = useCallback((x: number, y: number) => {
    'worklet';
    const centerX = width / 2;
    const centerY = (height - insets.top - insets.bottom) / 2;
    const dx = centerX - x;
    const dy = centerY - y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle += 90;
    angle = ((angle + 180) % 360) - 180;
    return angle;
  }, [width, height, insets.top, insets.bottom]);

  const imagePositions = useMemo(
    () => {
      const centerX = width / 2;
      const centerY = (height - insets.top - insets.bottom) / 2;
      
      // On calcule les positions pour toutes les taches
      return stainConfig.stains.map(stain => ({
        x: centerX + stain.position.x - STAIN_SIZE / 2,
        y: centerY + stain.position.y - STAIN_SIZE / 2
      }));
    },
    [width, height, insets.top, insets.bottom]
  );

  const getStainPosition = useCallback((faceId: number) => {
    // On utilise directement l'index de la face
    return imagePositions[faceId];
  }, [imagePositions]);

  const isInStain = useCallback((x: number, y: number) => {
    const currentPosition = getStainPosition(currentFaceIdState);
    return (
      x >= currentPosition.x &&
      x <= currentPosition.x + STAIN_SIZE &&
      y >= currentPosition.y &&
      y <= currentPosition.y + STAIN_SIZE
    );
  }, [getStainPosition, currentFaceIdState]);

  const getGridPosition = useCallback((x: number, y: number) => {
    if (!isInStain(x, y)) return { x: -1, y: -1 };

    const currentPosition = getStainPosition(currentFaceIdState);
    const relativeX = x - currentPosition.x;
    const relativeY = y - currentPosition.y;
    
    const gridX = Math.floor((relativeX / STAIN_SIZE) * GRID_SIZE);
    const gridY = Math.floor((relativeY / STAIN_SIZE) * GRID_SIZE);
    
    return { x: gridX, y: gridY };
  }, [getStainPosition, isInStain, currentFaceIdState]);

  const isInGrid = useCallback((x: number, y: number) => {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
  }, []);

  const updateGridAtPosition = useCallback((x: number, y: number) => {
    const gridPos = getGridPosition(x, y);
    if (isInGrid(gridPos.x, gridPos.y)) {
      setGrids(prev => {
        const newGrids = [...prev];
        newGrids[currentFaceId.value] = [...newGrids[currentFaceId.value]];
        newGrids[currentFaceId.value][gridPos.y] = [...newGrids[currentFaceId.value][gridPos.y]];
        if (!newGrids[currentFaceId.value][gridPos.y][gridPos.x]) {
          newGrids[currentFaceId.value][gridPos.y][gridPos.x] = true;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        return newGrids;
      });
    }
  }, [getGridPosition, isInGrid, currentFaceId.value]);

  const getCleanedPercentage = useCallback(() => {
    let cleaned = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grids[currentFaceId.value][i][j]) cleaned++;
      }
    }
    return cleaned / (GRID_SIZE * GRID_SIZE);
  }, [grids, currentFaceId.value]);

  useEffect(() => {
    if (getCleanedPercentage() >= CLEAN_THRESHOLD && !isCleaned) {
      setTimeout(() => {
        setIsCleaned(true);
        props.onDone();      
      }, 1000);
    }
  }, [grids, isCleaned, props, getCleanedPercentage]);

  const showArrows = useCallback((show: boolean) => {
    riveRef.current?.setInputStateAtPath("showArrows", show, "Object");
    setIsMenuVisible(show);
    if (show) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const isPointOnRag = useCallback((x: number, y: number) => {
    'worklet';
    const margin = 20; // Zone de tolérance de 20 pixels
    const ragBounds = {
      left: translateX.value - margin,
      right: translateX.value + RAG_WIDTH + margin,
      top: translateY.value - margin,
      bottom: translateY.value + (RAG_WIDTH/ragRatio) + margin
    };
    return x >= ragBounds.left && x <= ragBounds.right && y >= ragBounds.top && y <= ragBounds.bottom;
  }, []);

  const getDirection = useCallback((dx: number, dy: number) => {
    'worklet';
    const distance = Math.sqrt(dx * dx + dy * dy);
    // On ne déclenche le changement que si le mouvement est suffisant (50 pixels)
    if (distance < 50) return 0;
    
    // On ne regarde que le mouvement horizontal
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) return 1; // droite
      if (dx < 0) return 3; // gauche
    }
    return 0;
  }, []);

  const gesture = Gesture.Manual()
    .onTouchesDown((e, manager) => {
      'worklet';
      const touch = e.changedTouches[0];
      touchStartX.value = touch.x;
      touchStartY.value = touch.y;
      const isOnRag = isPointOnRag(touch.x, touch.y);
      if (!isOnRag) {
        isMenuMode.value = true;
        currentDirection.value = 0;
        pressProgress.value = withTiming(1, {
          duration: 200,
        }, (finished) => {
          if (finished && isMenuMode.value) {
            runOnJS(showArrows)(true);
            runOnJS(riveRef.current?.setInputStateAtPath)("direction", 0, "Object");
          }
        });
      } else {
        isMenuMode.value = false;
        startX.value = translateX.value;
        startY.value = translateY.value;
        const centerX = translateX.value + RAG_WIDTH/2;
        const centerY = translateY.value + RAG_WIDTH/2;
        cleanPath.value.moveTo(centerX, centerY);
        runOnJS(setIsRagHeld)(true);
        runOnJS(updateGridAtPosition)(centerX, centerY);
      }
      manager.activate();
    })
    .onTouchesMove((e, manager) => {
      'worklet';
      if (isMenuMode.value) {
        const touch = e.changedTouches[0];
        const dx = touch.x - touchStartX.value;
        const dy = touch.y - touchStartY.value;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 20) {
          const direction = getDirection(dx, dy);
          currentDirection.value = direction;
          runOnJS(riveRef.current?.setInputStateAtPath)("direction", direction, "Object");
        }
      } else if (isRagHeld) {
        const touch = e.changedTouches[0];
        translateX.value = startX.value + touch.x - touchStartX.value;
        translateY.value = startY.value + touch.y - touchStartY.value;
        
        const centerX = translateX.value + RAG_WIDTH/2;
        const centerY = translateY.value + RAG_WIDTH/2;
        
        cleanPath.value.lineTo(centerX, centerY);
        runOnJS(updateGridAtPosition)(centerX, centerY);

        const targetRotation = getRotationAngle(centerX, centerY);
        let newRotation = targetRotation;
        if (newRotation > 90) newRotation = 90;
        if (newRotation < -90) newRotation = -90;
        currentRotation.value += (newRotation - currentRotation.value) * 0.1;
      }
    })
    .onTouchesUp(() => {
      'worklet';
      if (isMenuMode.value) {
        runOnJS(showArrows)(false);
        runOnJS(riveRef.current?.setInputStateAtPath)("direction", 0, "Object");
        if (currentDirection.value !== 0) {
          runOnJS(updateFaceId)(currentDirection.value);
        }
      }
      if (isRagHeld) {
        runOnJS(setIsRagHeld)(false);
      }
      isMenuMode.value = false;
      pressProgress.value = 0;
      currentDirection.value = 0;
    });

  const paint = useMemo(() => {
    const p = Skia.Paint();
    p.setAntiAlias(true);
    p.setBlendMode(BlendMode.Clear);
    p.setStrokeWidth(BRUSH_SIZE);
    p.setStyle(PaintStyle.Stroke);
    return p;
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${currentRotation.value}deg` }
      ]
    };
  });

  const canvasStyle = useMemo(
    () => ({
      width,
      height: height - insets.top - insets.bottom,
      borderWidth: 1,
      borderColor: 'red',
    }),
    [height, insets.top, insets.bottom]
  );

  // Style pour la grille de debug
  const debugGridStyle = useMemo(() => {
    const paint = Skia.Paint();
    paint.setColor(Skia.Color('rgba(255, 0, 0, 0.2)'));
    return paint;
  }, []);

  const debugCleanedStyle = useMemo(() => {
    const paint = Skia.Paint();
    paint.setColor(Skia.Color('rgba(0, 255, 0, 0.2)'));
    return paint;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (riveRef.current) {
        riveRef.current?.setInputStateAtPath("FaceId", stainConfig.defaultFaceId, "Object");
        riveRef.current?.setInputStateAtPath("solo", stainConfig.defaultFaceId, "Object");
        riveRef.current?.setInputStateAtPath("showArrows", false, "Object");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Rendu de la grille de debug
  const renderDebugGrid = useCallback(() => {
    if (!debug) return null;

    const cellSize = STAIN_SIZE / GRID_SIZE;
    const startX = imagePositions[currentFaceIdState].x;
    const startY = imagePositions[currentFaceIdState].y;
    const cells = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const x = startX + i * cellSize;
        const y = startY + j * cellSize;
        cells.push(
          <Rect
            key={`${i}-${j}`}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            paint={grids[currentFaceId.value][j][i] ? debugCleanedStyle : debugGridStyle}
          />
        );
      }
    }

    return <Group>{cells}</Group>;
  }, [debug, grids, currentFaceId.value, debugGridStyle, debugCleanedStyle, imagePositions]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    rag: {
      width: RAG_WIDTH,
      aspectRatio: ragRatio,
      position: 'absolute',
      resizeMode: 'contain',
    }
  }), [ragRatio]);

  return (
    <SafeAreaView style={styles.container}>
      {!isCleaned && (
        <GestureDetector gesture={gesture}>
          <View style={StyleSheet.absoluteFill}>
            <Rive
              ref={riveRef}
              resourceName="clean"
              fit={Fit.Cover}
              artboardName="Clean"
              style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
            />
            <Canvas style={canvasStyle}>
              {loadedImages[currentFaceIdState] && (
                <Image
                  image={stainImages[currentFaceIdState]}
                  x={getStainPosition(currentFaceIdState).x}
                  y={getStainPosition(currentFaceIdState).y}
                  width={STAIN_SIZE}
                  height={STAIN_SIZE}
                />
              )}
              <Path
                path={cleanPath}
                paint={paint}
              />
              {renderDebugGrid()}
            </Canvas>
            <Animated.Image
              source={require('../assets/rag.png')}
              style={[
                styles.rag,
                animatedStyle,
              ]}
            />
          </View>
        </GestureDetector>
      )}
    </SafeAreaView>
  );
}
