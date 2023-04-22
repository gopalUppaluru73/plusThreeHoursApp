import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, ImageBackground, SafeAreaView, Image} from 'react-native'
import * as Location from 'expo-location'

import img from '../assets/gvsu.jpg'
import plus3 from '../assets/plus.jpeg'
import COLORS from '../config/colorsPanel'

export default function Welcome({navigation, weather, weatherInfo, time, setLatLon}) {
    const [location, setLocation] = useState(null)
    const [errMsg, setErrMsg] = useState(null)
    const reqLocation = async() => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
          setErrMsg('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location)
        weatherInfo(location?.coords?.latitude ?? 43.077366, location?.coords?.longitude ?? -85.994053)
        setLatLon(location?.coords?.latitude ?? null, location?.coords?.longitude ?? null)
    }
    useEffect(()=>{
        reqLocation()
        // setTimeout(()=>navigation.navigate('AccType'), 5000)
    }, [])
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground resizeMode='cover' source={img} style={{ flex: 1 }}>
        <View style={styles.container}>
            <View>
                <Image source={plus3} style={styles.plus3Logo} />
            </View>
            <View style={styles.titleview}>
                <Text style={styles.title} onPress={()=>navigation.navigate('AccType')}>Welcome to GVSU +3HRS</Text>
            </View>
        </View>
        </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    bottom: {
        width: '95%',
        position: 'absolute',
        bottom: 10,
        backgroundColor: COLORS.brandColor,
        borderRadius: 3
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    rowItem: {
        width: '48%',
        padding: 10
    },
    time: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
        color: COLORS.white
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: COLORS.white
    },
    titleview: {
        position: 'absolute',
        bottom: 50,
        width: '85%',
        alignSelf: 'center',
        borderRadius: 12,
        backgroundColor: COLORS.brandColor,
        padding: 10
    },
    plus3Logo: {
        width: 380, 
        height: 220,
        borderRadius: 12,
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center'
    }
})