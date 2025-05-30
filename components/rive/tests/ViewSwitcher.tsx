import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import Rive, {
  Fit,
  RiveRef,
  BindByName,
  RNRiveError,
  RNRiveErrorType,
  AutoBind,
  RiveGeneralEvent,
} from 'rive-react-native';

export default function ViewSwitcher() {
  const riveRef = useRef<RiveRef>(null);
  const currPieceIndex = useRef(1);
  const piecesLeft = useRef(11);
  const currViewIndex = useRef(1);
  const currViewName = useRef('X');
  const piecesInInventory = useRef([]);

  const extractId = (str: string) => {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });

    // if (stateName.includes('inInventory')) {
    //   const pieceId = stateName.split('_')[0];
    //   console.log('piece id', pieceId);
    //   riveRef.current?.setInputStateAtPath('isDraggable', false, `piece ${pieceId}`);
    //   piecesLeft.current -= 1;
    //   console.log('pieces left', piecesLeft.current);
    // }
  };

  const onPieceInInventory = (id: number) => {
    piecesInInventory.current = [...piecesInInventory.current, id];
    piecesLeft.current -= 1;
    riveRef.current?.setInputStateAtPath('full', true, `inventory_piece_${id}`);
    // setInInventory in all faces
    riveRef.current?.setInputStateAtPath('inInventory', true, `X${id}`);
    riveRef.current?.setInputStateAtPath('inInventory', true, `-X${id}`);
    riveRef.current?.setInputStateAtPath('inInventory', true, `Y${id}`);
    riveRef.current?.setInputStateAtPath('inInventory', true, `-Y${id}`);
  };
  const handleRiveEvent = (event: RiveGeneralEvent) => {
    console.log('Event received:', event);
    if (event.name.includes('inInventory')) {
      const pieceId = extractId(event.name);
      pieceId && onPieceInInventory(pieceId);
    }
  };
  const onChangePiece = () => {
    console.log('on change piece');
    console.log(currViewName.current, currPieceIndex.current);
    riveRef.current?.setInputStateAtPath(
      'isDraggable',
      true,
      `${currViewName.current}${currPieceIndex.current}`
    );
    currPieceIndex.current += 1;
  };

  const onChangeView = () => {
    console.log('on change view');
    if (currViewIndex.current === 1) {
      currViewIndex.current = 2;
      currViewName.current = '-Y';
    } else {
      currViewIndex.current = 1;
      currViewName.current = 'X';
    }
    console.log('view', currViewIndex.current);
    riveRef.current?.setInputState('main', 'vueID', currViewIndex.current);
  };

  return (
    <View className="flex h-full w-full flex-1">
      <View className="h-full w-full flex-1">
        <Rive
          ref={riveRef}
          resourceName="viewSwitcher_11"
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
      </View>

      <View className="h-1/8 absolute bottom-0 z-10 m-6 flex w-full items-center justify-end bg-slate-100">
        <Pressable onPress={onChangePiece} className="m-6">
          <Text className="font-bold uppercase text-orange-600">change piece</Text>
        </Pressable>
        <Pressable onPress={onChangeView}>
          <Text className="font-bold uppercase text-orange-600">change View</Text>
        </Pressable>
      </View>
    </View>
  );
}
