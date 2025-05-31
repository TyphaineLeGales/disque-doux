import React, { useRef } from 'react';
import { Text, View, Pressable, ImageBackground } from 'react-native';
import Rive, {
  Fit,
  RiveRef,
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
  const _VIEWS = {
    1: 'X',
    2: '-Y',
    3: '-X',
    4: 'Y',
  };

  const extractId = (str: string) => {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
  };

  const setInputForAllViews = (stateName: string, value: boolean | number, id: number) => {
    riveRef.current?.setInputStateAtPath(stateName, value, `X${id}`);
    riveRef.current?.setInputStateAtPath(stateName, value, `-X${id}`);
    riveRef.current?.setInputStateAtPath(stateName, value, `Y${id}`);
    riveRef.current?.setInputStateAtPath(stateName, value, `-Y${id}`);
  };

  const onPieceInInventory = (id: number) => {
    piecesInInventory.current = [...piecesInInventory.current, id];
    piecesLeft.current -= 1;
    riveRef.current?.setInputStateAtPath('full', true, `inventory_piece_${id}`);
    setInputForAllViews('inInventory', true, id);
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
    setInputForAllViews('isDraggable', true, currPieceIndex.current);
    currPieceIndex.current += 1;
  };

  const onChangeView = () => {
    console.log('on change view', currViewIndex.current);
    currViewIndex.current += 1;
    if (currViewIndex.current === 5) currViewIndex.current = 1;

    currViewName.current = _VIEWS[currViewIndex.current];
    riveRef.current?.setInputState('main', 'vueID', currViewIndex.current);
  };

  return (
    <View className="flex h-full w-full flex-1 bg-[#FEF7E1]">
      <ImageBackground
        source={require('../../../assets/images/BackgroundQuadrille.svg')}
        resizeMode="stretch"
        className="m-0 h-[100vw] w-[100vw] flex-1 p-0">
        <View className="h-full w-full flex-1">
          <Rive
            ref={riveRef}
            resourceName="viewSwitcher_15"
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

          <View className="h-1/10 absolute bottom-1/4 z-10 m-6 flex w-full items-center justify-end">
            <Pressable onPress={onChangePiece} className="m-6">
              <Text className="font-bold uppercase text-orange-600">change piece</Text>
            </Pressable>
            <Pressable onPress={onChangeView}>
              <Text className="font-bold uppercase text-orange-600">change View</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
