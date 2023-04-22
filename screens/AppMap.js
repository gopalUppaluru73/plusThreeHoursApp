import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import COLORS from '../config/colorsPanel';


export default function AppMap({navigation}) {
  const [location, setLocation] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  const reqLocation = async() => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      setErrMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log(location)
    setLocation(location)
  }

  useEffect(()=>{
    reqLocation();
  }, []);

  let text = 'Waiting...';
  if(errMsg){
    text = errMsg;
  }else if(location){
    text = JSON.stringify(location);
  }

  const go = () => {
    navigation.navigate('Home', {location})
  }
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
      >
        {
          location
          ?
            // <Marker 
            //   key={4350}
            //   onPress={go} 
            //   coordinate={{ 
            //     latitude: location.coords?.latitude, 
            //     longitude: location.coords?.longitude 
            //   }} 
            // />
            <Marker coordinates={{latitude: 5.5635371, longitude: -0.2358689}} />
          :
          <Marker coordinates={{latitude: 5.5635371, longitude: -0.2358689}} />
        }
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%'
  }
});
