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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, runOnJS } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Rive, { Fit, RiveRef } from 'rive-react-native';

import { StainPosition } from '@/utils/StainPosition';

type CleanProps = {
  onDone: Function;
  id: string;
  debug?: boolean;
};

const { width, height } = Dimensions.get('window');
const RAG_WIDTH = 70;
const BRUSH_SIZE = 50;
const CLEAN_THRESHOLD = 0.8;
const GRID_SIZE = 7;
const STAIN_SIZE = 130;

export default function Clean(props: CleanProps) {
  const { debug = false } = props;
  const [isCleaned, setIsCleaned] = useState(false);
  const [isRagHeld, setIsRagHeld] = useState(false);
  const [ragRatio, setRagRatio] = useState(1);
  const [grid, setGrid] = useState<boolean[][]>(
    Array(GRID_SIZE)
      .fill(false)
      .map(() => Array(GRID_SIZE).fill(false))
  );

  const stainImage = useImage(require('../../../assets/stain.png'));
  const insets = useSafeAreaInsets();
  const riveRef = useRef<RiveRef>(null);

  useEffect(() => {
    RNImage.getSize(
      RNImage.resolveAssetSource(require('../../../assets/rag.png')).uri,
      (width, height) => {
        setRagRatio(width / height);
      }
    );
  }, []);

  const startX = useSharedValue(width * 0.75 - RAG_WIDTH / 2);
  const startY = useSharedValue((height - insets.bottom) * 0.75 - RAG_WIDTH / ragRatio / 2);
  const translateX = useSharedValue(width * 0.75 - RAG_WIDTH / 2);
  const translateY = useSharedValue((height - insets.bottom) * 0.75 - RAG_WIDTH / ragRatio / 2);
  const cleanPath = useSharedValue<SkPath>(Skia.Path.Make());
  const currentRotation = useSharedValue(0);

  const getRotationAngle = useCallback(
    (x: number, y: number) => {
      'worklet';
      const centerX = width / 2;
      const centerY = (height - insets.top - insets.bottom) / 2;
      const dx = centerX - x;
      const dy = centerY - y;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      angle += 90;
      angle = ((angle + 180) % 360) - 180;
      return angle;
    },
    [width, height, insets.top, insets.bottom]
  );

  const imagePosition = useMemo(
    () =>
      StainPosition.calculatePosition(
        width,
        height,
        insets.top,
        insets.bottom,
        STAIN_SIZE,
        72, // 70% depuis la gauche
        45 // 40% depuis le haut
      ),
    [width, height, insets.top, insets.bottom]
  );

  const isInStain = useCallback(
    (x: number, y: number) => {
      return (
        x >= imagePosition.x &&
        x <= imagePosition.x + STAIN_SIZE &&
        y >= imagePosition.y &&
        y <= imagePosition.y + STAIN_SIZE
      );
    },
    [imagePosition]
  );

  const getGridPosition = useCallback(
    (x: number, y: number) => {
      if (!isInStain(x, y)) return { x: -1, y: -1 };

      const relativeX = x - imagePosition.x;
      const relativeY = y - imagePosition.y;

      const gridX = Math.floor((relativeX / STAIN_SIZE) * GRID_SIZE);
      const gridY = Math.floor((relativeY / STAIN_SIZE) * GRID_SIZE);

      return { x: gridX, y: gridY };
    },
    [imagePosition, isInStain]
  );

  const isInGrid = useCallback((x: number, y: number) => {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
  }, []);

  const updateGridAtPosition = useCallback(
    (x: number, y: number) => {
      const gridPos = getGridPosition(x, y);
      if (isInGrid(gridPos.x, gridPos.y)) {
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[gridPos.y] = [...newGrid[gridPos.y]];
          if (!newGrid[gridPos.y][gridPos.x]) {
            newGrid[gridPos.y][gridPos.x] = true;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          return newGrid;
        });
      }
    },
    [getGridPosition, isInGrid]
  );

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
      setTimeout(() => {
        setIsCleaned(true);
        props.onDone();
      }, 1000);
    }
  }, [grid, isCleaned, props, getCleanedPercentage]);

  const gesture = Gesture.Pan()
    .onStart((e) => {
      startX.value = translateX.value;
      startY.value = translateY.value;
      const centerX = translateX.value + RAG_WIDTH / 2;
      const centerY = translateY.value + RAG_WIDTH / 2;
      cleanPath.value.moveTo(centerX, centerY);
      runOnJS(setIsRagHeld)(true);
      runOnJS(updateGridAtPosition)(centerX, centerY);
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;

      const centerX = translateX.value + RAG_WIDTH / 2;
      const centerY = translateY.value + RAG_WIDTH / 2;

      if (isRagHeld) {
        cleanPath.value.lineTo(centerX, centerY);
        runOnJS(updateGridAtPosition)(centerX, centerY);
      }

      const targetRotation = getRotationAngle(centerX, centerY);

      let newRotation = targetRotation;
      if (newRotation > 90) newRotation = 90;
      if (newRotation < -90) newRotation = -90;

      currentRotation.value += (newRotation - currentRotation.value) * 0.1;
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

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${currentRotation.value}deg` },
      ],
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

  // Rendu de la grille de debug
  const renderDebugGrid = useCallback(() => {
    if (!debug) return null;

    const cellSize = STAIN_SIZE / GRID_SIZE;
    const startX = imagePosition.x;
    const startY = imagePosition.y;
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
            paint={grid[j][i] ? debugCleanedStyle : debugGridStyle}
          />
        );
      }
    }

    return <Group>{cells}</Group>;
  }, [debug, grid, debugGridStyle, debugCleanedStyle, imagePosition]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
        },
      }),
    [ragRatio]
  );

  return (
    <SafeAreaView style={styles.container}>
      {!isCleaned && (
        <View style={StyleSheet.absoluteFill}>
          <Rive
            ref={riveRef}
            resourceName="clean"
            fit={Fit.Cover}
            style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
          />
          <Canvas style={canvasStyle}>
            <Image
              image={stainImage}
              x={imagePosition.x}
              y={imagePosition.y}
              width={STAIN_SIZE}
              height={STAIN_SIZE}
            />
            <Path path={cleanPath} paint={paint} />
            {renderDebugGrid()}
          </Canvas>
          <GestureDetector gesture={gesture}>
            <Animated.Image
              source={require('../../../assets/rag.png')}
              style={[styles.rag, animatedStyle]}
            />
          </GestureDetector>
        </View>
      )}
    </SafeAreaView>
  );
}
