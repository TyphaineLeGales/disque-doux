import * as Haptics from 'expo-haptics';
import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import Rive, {
  Fit,
  RiveRef,
  RNRiveError,
  RNRiveErrorType,
  AutoBind,
  RiveGeneralEvent,
} from 'rive-react-native';

import ToothbrushCleaning from '../rive/final/ToothbrushCleaning';

import Unscrew from '@/components/rive/final/Unscrew';
import Wiggle from '@/components/rive/final/Wiggle';
import { useLevelStore } from '@/stores/levelStore';

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
  const currPieceIndex = useRef(0);
  const currViewIndex = useRef(0);
  const piecesInInventory = useRef<number[]>([]);
  const [showUnscrew, setShowUnscrew] = useState(false);
  const [showWiggle, setShowWiggle] = useState(false);
  const [showClean, setShowClean] = useState(false);
  const cleanPieceId = useRef(9);
  const showScrewTuto = useRef(true);
  const screwsLeft = useRef<number[]>([1, 2, 3, 4]);
  const wiggleLeft = useRef(2);
  const outsidePieces = useRef([1, 2, 3, 4, 5, 6, 7, 8]);
  const { setHideProgressBar } = useLevelStore();

  const shouldShowCleanGame = () => {
    if (screwsLeft.current.length !== 0) {
      return false;
    }

    if (wiggleLeft.current !== 0) {
      return false;
    }

    const allOutsidePiecesAreGone = outsidePieces.current.every((piece: number) =>
      piecesInInventory.current.includes(piece)
    );

    if (!allOutsidePiecesAreGone) {
      return false;
    }
    return true;
  };

  const onChangeView = (direction: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (direction === 'right') {
      currViewIndex.current += 1;
      if (currViewIndex.current === 4) {
        currViewIndex.current = 0;
      }
    } else {
      if (currViewIndex.current === 0) {
        currViewIndex.current = 3;
      } else {
        currViewIndex.current -= 1;
      }
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
    showScrewTuto.current = false;
    setShowUnscrew(false);
    riveRef?.current?.play();
    setHideProgressBar(false);
  };

  const onCleanDone = () => {
    riveRef?.current?.play();
    setShowClean(false);
    setHideProgressBar(false);
    setInputForAllViews('inInventory', true, cleanPieceId.current);
    riveRef.current?.setInputStateAtPath('full', true, `inventory_piece_${cleanPieceId}`);
    piecesInInventory.current = [...piecesInInventory.current, cleanPieceId.current];
  };

  const onWiggleDone = () => {
    setShowWiggle(false);
    riveRef?.current?.play();

    if (wiggleLeft.current === 2) {
      // switch to X vue
      currViewIndex.current = 0;
      riveRef.current?.setInputState('State Machine 1', 'views', currViewIndex.current);
      setInputForAllViews('inInventory', true, 3);
      riveRef.current?.setInputStateAtPath('full', true, 'inventory_piece_3');
      piecesInInventory.current = [...piecesInInventory.current, 3];
    } else {
      setInputForAllViews('inInventory', true, 4);
      riveRef.current?.setInputStateAtPath('full', true, 'inventory_piece_4');
      piecesInInventory.current = [...piecesInInventory.current, 4];
      currPieceIndex.current = 1;
      setInputForAllViews('isDraggable', true, 1);
    }
    wiggleLeft.current -= 1;
    setHideProgressBar(false);
  };

  const onToolDropped = () => {
    riveRef.current?.setInputStateAtPath('isOpen', false, 'toolLayer /toolbox');
    riveRef.current?.setInputStateAtPath('screwdriverSelected', false, 'toolLayer ');
  };

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateName });
    if (stateName.toLowerCase().includes('clean')) {
      if (shouldShowCleanGame()) {
        cleanPieceId.current = parseInt(stateName.match(/\d+/)?.[0] || '', 10);
      }
      shouldShowCleanGame() && setShowClean(true);
      console.log(
        'shouldShowCleanGame: ',
        shouldShowCleanGame(),
        'for piece',
        cleanPieceId.current
      );
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
    // remove id from screwsLeft.current
    screwsLeft.current = screwsLeft.current.filter((screwId) => screwId !== id);
  };

  const onPieceInInventory = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    piecesInInventory.current = [...piecesInInventory.current, id];
    riveRef.current?.setInputStateAtPath('full', true, `inventory_piece_${id}`);
    setInputForAllViews('inInventory', true, id);
    onProgress(piecesInInventory.current.length / TOTAL_PIECES);
    console.log(piecesInInventory.current);
    if (piecesInInventory.current.length === TOTAL_PIECES) {
      props.onDone();
    }
  };

  const handleRiveEvent = (event: RiveGeneralEvent) => {
    console.log('event', event.name);
    if (event.name.includes('inInventory')) {
      const pieceId = extractId(event.name);
      pieceId && onPieceInInventory(pieceId);
    }

    if (event.name === 'wiggle' && screwsLeft.current.length === 0) {
      console.log('wiggle');
      onToolDropped();
      if (wiggleLeft.current > 0) {
        setShowWiggle(true);
        setHideProgressBar(true);
      }
    }

    if (event.name.includes('screwTarget')) {
      console.log('in screw target');
      const targetType = extractDirection(event.name)?.toLowerCase();
      const screwId = SCREWTARGETS[currViewIndex.current][targetType];
      onToolDropped();
      if (screwsLeft.current.includes(screwId)) {
        hideScrew(screwId);
        riveRef?.current?.pause();
        setShowUnscrew(true);
        setHideProgressBar(true);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (event.name === 'rightBtnPressed') {
      onChangeView('right');
    }

    if (event.name === 'leftBtnPress') {
      onChangeView('left');
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
          resourceName="disassemble54"
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
        </View>
      </View>
      {showUnscrew && <Unscrew onDone={onScrewingDone} showTuto={showScrewTuto.current} />}
      {screwsLeft.current.length === 0 && showWiggle && (
        <Wiggle onDone={onWiggleDone} showTuto={wiggleLeft.current === 2} />
      )}
      {showClean && (
        <ToothbrushCleaning onDone={onCleanDone} showTuto={false} pieceId={cleanPieceId.current} />
      )}
    </View>
  );
}
