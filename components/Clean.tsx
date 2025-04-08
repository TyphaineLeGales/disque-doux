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
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Image as RNImage } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

type CleanProps = {
  onDone: Function;
  id: string;
  debug?: boolean;
};

const { width, height } = Dimensions.get('window');
const IMAGE_SIZE = 200;
const RAG_WIDTH = 70;
const BRUSH_SIZE = 30;
const CLEAN_THRESHOLD = 0.9;
const GRID_SIZE = 10;

export default function Clean(props: CleanProps) {
  const { debug = false } = props;
  const [isCleaned, setIsCleaned] = useState(false);
  const [isRagHeld, setIsRagHeld] = useState(false);
  const [ragRatio, setRagRatio] = useState(1);
  const [grid, setGrid] = useState<boolean[][]>(Array(GRID_SIZE).fill(false).map(() => Array(GRID_SIZE).fill(false)));
  
  const stainImage = useImage(require('../assets/stain.png'));
  const insets = useSafeAreaInsets();

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

  const getGridPosition = useCallback((x: number, y: number) => {
    const relativeX = x - (width / 2 - IMAGE_SIZE / 2);
    const relativeY = y - ((height - insets.top - insets.bottom) / 2 - IMAGE_SIZE / 2);
    
    const gridX = Math.floor((relativeX / IMAGE_SIZE) * GRID_SIZE);
    const gridY = Math.floor((relativeY / IMAGE_SIZE) * GRID_SIZE);
    
    return { x: gridX, y: gridY };
  }, [width, height, insets.top, insets.bottom]);

  const isInGrid = useCallback((x: number, y: number) => {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
  }, []);

  const updateGridAtPosition = useCallback((x: number, y: number) => {
    const gridPos = getGridPosition(x, y);
    if (isInGrid(gridPos.x, gridPos.y)) {
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[gridPos.x] = [...newGrid[gridPos.x]];
        if (!newGrid[gridPos.x][gridPos.y]) {
          newGrid[gridPos.x][gridPos.y] = true;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
        return newGrid;
      });
    }
  }, [getGridPosition, isInGrid]);

  const getCleanedPercentage = useCallback(() => {
    let cleaned = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j]) cleaned++;
      }
    }
    return cleaned / (GRID_SIZE * GRID_SIZE);
  }, [grid]);

  useEffect(() => {
    if (getCleanedPercentage() >= CLEAN_THRESHOLD && !isCleaned) {
      setIsCleaned(true);
      props.onDone();
    }
  }, [grid, isCleaned, props, getCleanedPercentage]);

  const gesture = Gesture.Pan()
    .onStart((e) => {
      startX.value = translateX.value;
      startY.value = translateY.value;
      const centerX = translateX.value + RAG_WIDTH/2;
      const centerY = translateY.value + RAG_WIDTH/2;
      cleanPath.value.moveTo(centerX, centerY);
      runOnJS(setIsRagHeld)(true);
      runOnJS(updateGridAtPosition)(centerX, centerY);
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
      
      const centerX = translateX.value + RAG_WIDTH/2;
      const centerY = translateY.value + RAG_WIDTH/2;
      
      if (isRagHeld) {
        cleanPath.value.lineTo(centerX, centerY);
        runOnJS(updateGridAtPosition)(centerX, centerY);
      }
    })
    .onEnd(() => {
      runOnJS(setIsRagHeld)(false);
    });

  const paint = useMemo(() => {
    const p = Skia.Paint();
    p.setAntiAlias(true);
    p.setBlendMode(BlendMode.Clear);
    p.setStrokeWidth(BRUSH_SIZE);
    p.setStyle(PaintStyle.Stroke);
    return p;
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }));

  const canvasStyle = useMemo(
    () => ({
      width,
      height: height - insets.top - insets.bottom,
      borderWidth: 1,
      borderColor: 'red',
    }),
    [height, insets.top, insets.bottom]
  );

  const imagePosition = useMemo(
    () => ({
      x: width / 2 - IMAGE_SIZE / 2,
      y: (height - insets.top - insets.bottom) / 2 - IMAGE_SIZE / 2,
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

  // Rendu de la grille de debug
  const renderDebugGrid = useCallback(() => {
    if (!debug) return null;

    const cellSize = IMAGE_SIZE / GRID_SIZE;
    const startX = width / 2 - IMAGE_SIZE / 2;
    const startY = (height - insets.top - insets.bottom) / 2 - IMAGE_SIZE / 2;
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
            paint={grid[i][j] ? debugCleanedStyle : debugGridStyle}
          />
        );
      }
    }

    return <Group>{cells}</Group>;
  }, [debug, grid, debugGridStyle, debugCleanedStyle, width, height, insets]);

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
        <View style={StyleSheet.absoluteFill}>
          <Canvas style={canvasStyle}>
            <Image
              image={stainImage}
              x={imagePosition.x}
              y={imagePosition.y}
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
            />
            <Path
              path={cleanPath}
              paint={paint}
            />
            {renderDebugGrid()}
          </Canvas>
          <GestureDetector gesture={gesture}>
            <Animated.Image
              source={require('../assets/rag.png')}
              style={[
                styles.rag,
                animatedStyle,
                { opacity: isRagHeld ? 0.8 : 1 }
              ]}
            />
          </GestureDetector>
        </View>
      )}
    </SafeAreaView>
  );
}
