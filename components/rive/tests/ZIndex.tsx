import React, { useRef, useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Rive, { Fit, RiveRef, RiveGeneralEvent, RiveOpenUrlEvent } from 'rive-react-native';

export default function ZIndex() {
  const riveRef = useRef<RiveRef>(null);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    console.log('hide', hide);
  }, [hide]);

  // apply pointer-event-none once object is in the inventory
  const handleStateChange = (stateMachineName: string, stateName: string) => {
    console.log('State changed:', { stateMachineName, stateName });
    if (stateName === 'inInventory') {
      setHide(true);
    }
  };

  return (
    <View className="h-full w-full flex-1">
      <View className={`absolute left-0 top-0 h-full w-full `}>
        <Rive
          ref={riveRef}
          resourceName="test_z_index_3"
          onStateChanged={handleStateChange}
          artboardName="test 2"
          fit={Fit.Contain}
          style={{
            height: '75%',
          }}
        />
      </View>
      <View className={`absolute left-0 top-0 h-full w-full ${hide && 'pointer-events-none'}`}>
        <Rive
          ref={riveRef}
          resourceName="test_z_index_3"
          onStateChanged={handleStateChange}
          artboardName="test 1"
          fit={Fit.Contain}
          style={{
            height: '75%',
          }}
        />
      </View>
    </View>
  );
}
