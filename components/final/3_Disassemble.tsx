import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import Rive, {
  Fit,
  RiveRef,
  RNRiveError,
  RNRiveErrorType,
  AutoBind,
  RiveGeneralEvent,
} from 'rive-react-native';

import Unscrew from '@/components/rive/final/Unscrew';

type DisassembleProps = {
  onDone: Function;
  id: string;
  debug?: boolean;
  onProgress: Function;
};

export default function Disassemble(props: DisassembleProps) {
  const { onProgress } = props;
  const TOTAL_PIECES = 11;
  const SCREWTARGETS = [
    {
      top: 2,
      bottom: 4,
      left: 1,
      right: 3,
    },
    {
      top: 1,
      bottom: 3,
      left: 4,
      right: 2,
    },
    {
      top: 4,
      bottom: 2,
      left: 3,
      right: 1,
    },
    {
      top: 2,
      bottom: 1,
      left: 3,
      right: 4,
    },
  ];
  const riveRef = useRef<RiveRef>(null);
  const currPieceIndex = useRef(1);
  const currViewIndex = useRef(0);
  //const currViewName = useRef('X'); -> _views[currViewIndex]
  const piecesInInventory = useRef([]);
  const _VIEWS = ['X', '-Y', '-X', 'Y'];
  const [showUnscrew, setShowUnscrew] = useState(false);
  const showScrewTuto = useRef(true);

  const onChangeView = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    currViewIndex.current += 1;
    if (currViewIndex.current === 4) {
      currViewIndex.current = 0;
    }
    riveRef.current?.setInputState('State Machine 1', 'views', currViewIndex.current);
  };

  const extractId = (str: string) => {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const extractDirection = (label: string) => {
    const match = label.match(/(Right|Left|Top|Bottom)$/);
    return match ? match[1] : null;
  };

  const onScrewingDone = () => {
    riveRef.current?.setInputState('State Machine 1', 'showunscrew', false);
    showScrewTuto.current = false;
    setShowUnscrew(false);
    riveRef?.current?.play();
  };

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
    if (stateName === 'showunscrew') {
      riveRef.current?.setInputStateAtPath('isOpen', false, 'toolLayer /toolbox');
      riveRef.current?.setInputStateAtPath('screwdriverSelected', false, 'toolLayer ');
      riveRef?.current?.pause();
      setShowUnscrew(true);
    }
  };

  const setInputForAllViews = (stateName: string, value: boolean | number, id: number) => {
    riveRef.current?.setInputStateAtPath(stateName, value, `X${id}`);
    riveRef.current?.setInputStateAtPath(stateName, value, `-X${id}`);
    riveRef.current?.setInputStateAtPath(stateName, value, `Y${id}`);
    riveRef.current?.setInputStateAtPath(stateName, value, `-Y${id}`);
  };

  const hideScrew = (id: number) => {
    riveRef.current?.setInputStateAtPath('hide', true, `visX${id}`);
    riveRef.current?.setInputStateAtPath('hide', true, `vis-X${id}`);
    riveRef.current?.setInputStateAtPath('hide', true, `visY${id}`);
    riveRef.current?.setInputStateAtPath('hide', true, `vis-Y${id}`);
  };

  const onPieceInInventory = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    piecesInInventory.current = [...piecesInInventory.current, id];
    riveRef.current?.setInputStateAtPath('full', true, `inventory_piece_${id}`);
    setInputForAllViews('inInventory', true, id);
    onProgress(piecesInInventory.current.length / TOTAL_PIECES);
    if (piecesInInventory.current.length === TOTAL_PIECES - 1) {
      props.onDone();
    }
  };

  const handleRiveEvent = (event: RiveGeneralEvent) => {
    console.log('event', event);
    if (event.name.includes('inInventory')) {
      const pieceId = extractId(event.name);
      pieceId && onPieceInInventory(pieceId);
    }

    if (event.name.includes('screwTarget')) {
      const targetType = extractDirection(event.name)?.toLowerCase();
      const screwId = SCREWTARGETS[currViewIndex.current][targetType];
      console.log(targetType, _VIEWS[currViewIndex.current], screwId);
      hideScrew(screwId);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  const onChangePiece = () => {
    setInputForAllViews('isDraggable', true, currPieceIndex.current);
    currPieceIndex.current += 1;
  };

  return (
    <View className="flex h-full w-full flex-1 bg-[#FEF7E1]">
      <View className="absolute h-full w-full flex-1">
        <Rive
          ref={riveRef}
          resourceName="disassemble32"
          artboardName="main"
          onStateChanged={handleStateChange}
          onRiveEventReceived={handleRiveEvent}
          fit={Fit.Contain}
          style={{
            width: '100%',
          }}
          dataBinding={AutoBind(true)}
          onError={(riveError: RNRiveError) => {
            switch (riveError.type) {
              case RNRiveErrorType.DataBindingError: {
                console.error(`${riveError.message}`);
                return;
              }
              default:
                console.error('Unhandled error');
            }
          }}
        />

        <View className="h-1/10 w-1/3items-start absolute bottom-[100px] z-10 m-6 flex justify-end">
          <Pressable onPress={onChangePiece} className="m-6">
            <Text className="font-bold uppercase text-orange-600">change piece</Text>
          </Pressable>
          <Pressable onPress={onChangeView} className="m-6">
            <Text className="font-bold uppercase text-orange-600">change view</Text>
          </Pressable>
        </View>
      </View>
      {showUnscrew && <Unscrew onDone={onScrewingDone} showTuto={showScrewTuto.current} />}
    </View>
  );
}
