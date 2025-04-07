import {
  Canvas,
  Image,
  useImage,
  Path,
  Skia,
  Paint,
  BlendMode,
  SkPath,
} from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import React, { useState, useCallback, useMemo } from 'react';
import { Dimensions, GestureResponderEvent } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type CleanProps = {
  onDone: Function;
  id: string;
};

const { width } = Dimensions.get('window');
const IMAGE_SIZE = 200;
const BRUSH_SIZE = 15;
const POINT_DENSITY = 3;
const RANDOM_OFFSET = 2;

export default function Clean(props: CleanProps) {
  const [isCleaned, setIsCleaned] = useState(false);
  const [paths, setPaths] = useState<SkPath[]>([]);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const stainImage = useImage(require('../assets/stain.png'));
  const insets = useSafeAreaInsets();

  const canvasStyle = useMemo(
    () => ({
      width,
      height: Dimensions.get('window').height - insets.top - insets.bottom,
    }),
    [width, insets.top, insets.bottom]
  );

  const imagePosition = useMemo(
    () => ({
      x: width / 2 - IMAGE_SIZE / 2,
      y: (Dimensions.get('window').height - insets.top - insets.bottom) / 2 - IMAGE_SIZE / 2,
    }),
    [width, insets.top, insets.bottom]
  );

  const createRandomPoint = useCallback((x: number, y: number) => {
    const randomX = x + (Math.random() - 0.5) * RANDOM_OFFSET;
    const randomY = y + (Math.random() - 0.5) * RANDOM_OFFSET;
    const randomSize = BRUSH_SIZE * (0.8 + Math.random() * 0.4);
    return { x: randomX, y: randomY, size: randomSize };
  }, []);

  const onTouchStart = useCallback(
    (e: GestureResponderEvent) => {
      const { locationX, locationY } = e.nativeEvent;
      setLastPoint({ x: locationX, y: locationY });

      const newPaths: SkPath[] = [];
      for (let i = 0; i < POINT_DENSITY; i++) {
        const point = createRandomPoint(locationX, locationY);
        const path = Skia.Path.Make();
        path.addCircle(point.x, point.y, point.size / 2);
        newPaths.push(path);
      }

      setPaths((prev) => [...prev, ...newPaths]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [createRandomPoint]
  );

  const onTouchMove = useCallback(
    (e: GestureResponderEvent) => {
      const { locationX, locationY } = e.nativeEvent;

      const dx = locationX - lastPoint.x;
      const dy = locationY - lastPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > BRUSH_SIZE / 2) {
        const steps = Math.ceil(distance / (BRUSH_SIZE / 2));
        const newPaths: SkPath[] = [];

        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const x = lastPoint.x + dx * t;
          const y = lastPoint.y + dy * t;

          // Créer plusieurs points à chaque étape
          for (let j = 0; j < POINT_DENSITY; j++) {
            const point = createRandomPoint(x, y);
            const path = Skia.Path.Make();
            path.addCircle(point.x, point.y, point.size / 2);
            newPaths.push(path);
          }
        }

        setPaths((prev) => [...prev, ...newPaths]);
        setLastPoint({ x: locationX, y: locationY });
      }
    },
    [lastPoint, createRandomPoint]
  );

  const paint = useMemo(() => {
    const p = Skia.Paint();
    p.setAntiAlias(true);
    p.setColor(Skia.Color('black'));
    p.setStrokeWidth(BRUSH_SIZE);
    p.setBlendMode(BlendMode.Clear);
    return p;
  }, []);

  return (
    <SafeAreaView style={{ position: 'absolute', top: -insets.top, left: 0, right: 0, bottom: 0 }}>
      {!isCleaned && (
        <Canvas style={canvasStyle} onTouchStart={onTouchStart} onTouchMove={onTouchMove}>
          <Image
            image={stainImage}
            x={imagePosition.x}
            y={imagePosition.y}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
          />
          {paths.map((path, index) => (
            <Path key={index} path={path} paint={paint} />
          ))}
        </Canvas>
      )}
    </SafeAreaView>
  );
}
