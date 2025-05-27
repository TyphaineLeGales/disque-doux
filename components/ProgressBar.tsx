import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

type ProgressBarProps = {
  currentPhase: number;
  totalPhases: number;
  phaseProgress: number;
};

export const ProgressBar = ({ currentPhase, totalPhases, phaseProgress }: ProgressBarProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${phaseProgress * 100}%`, { duration: 300 }),
    };
  });

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 9999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: 16 }}>
      {Array.from({ length: totalPhases }).map((_, index) => (
        <React.Fragment key={index}>
          <View
            style={{
              height: 16,
              width: 16,
              borderRadius: 8,
              backgroundColor: index === currentPhase
                ? '#EC7611'
                : index < currentPhase
                ? 'rgba(236, 118, 17, 0.5)'
                : 'rgba(232, 194, 156, 0.5)'
            }}
          />
          {index < totalPhases - 1 && (
            <View style={{ height: 4, width: 48, backgroundColor: 'rgba(232, 194, 156, 0.5)' }}>
              <Animated.View 
                style={[
                  { height: '100%' },
                  index === currentPhase 
                    ? animatedStyle 
                    : { width: `${index < currentPhase ? 100 : 0}%` },
                  {
                    backgroundColor: index < currentPhase 
                      ? 'rgba(236, 118, 17, 0.5)'
                      : index === currentPhase 
                      ? '#EC7611'
                      : 'transparent'
                  }
                ]}
              />
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}; 