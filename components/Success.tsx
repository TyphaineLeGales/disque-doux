import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native';

type SuccessProps = {
  onAnimationComplete: () => void;
};

export default function Success({ onAnimationComplete }: SuccessProps) {
  const riveComponentRef = useRef<RiveRef>(null);

  const animationDuration = 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, animationDuration);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <View className="absolute bottom-0 left-0 right-0 top-0">
      <Rive
        ref={riveComponentRef}
        resourceName="success"
        fit={Fit.Cover}
        autoplay
        animationName="Success"
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}
