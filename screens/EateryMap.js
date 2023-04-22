import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Image, Text} from 'react-native';

import MapView, {Marker} from 'react-native-maps';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebaseConfig from '../config/cred';
import Toast from 'react-native-root-toast';

export default function SubwayMap({navigation, user, weather, time}) {
    const [eatery, setEatery] = useState([])

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const dbref = ref(db, 'EateryAccount');

    useEffect(()=>{
        navigation.setOptions({
          headerRight: ()=>(
            <Text style={{ padding: 10, fontSize: 16, color: '#fff', fontWeight: 'bold' }}>{time}</Text>
          ),
          headerLeft: ()=>(
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <View><Image source={weather.icon} style={{ width: 50, height: 50 }} /></View>
              <View>
                <Text style={{ color: '#fff', fontSize: 12 }}>{weather.temp}</Text>
                <Text style={{ color: '#fff', fontSize: 12 }}>{weather.description}</Text>
              </View>
            </View>
          )
        })
    })

    useEffect(()=>{
        onValue(dbref, snapshot=>{
          if(snapshot.exists()){
            const data = snapshot.val()
            const keys = Object.keys(data)
            const arr = []
            keys.forEach(key => arr.push({...data[key], id: key}))
            setEatery(arr)
          }
        })
    }, [])

    const goToEatery = item => {
        const d = new Date()
        if(item.date === d.toLocaleDateString()){
            if(d.getHours() >= 18 && d.getHours() < 21){
                navigation.navigate('AddSub', item)
            }else{
                Toast.show('Superbowl is only available betweens the hours of 18-21', {duration: Toast.durations.LONG})
            }
        }else{
            Toast.show(`No available superbowl from ${item.name} today`, {duration: Toast.durations.LONG})
        }
    }

    const marklist = eatery.length === 0 ? <React.Fragment /> : eatery.map((item, index)=>(
        <Marker 
            title={item?.name ?? ''}
            onPress={()=>goToEatery(item)}
            key={item.id} 
            coordinate={{ 
                latitude: item?.latitude, 
                longitude: item?.longitude
            }} 
        />
    ))
  return (
    <SafeAreaView style={styles.container}>
        <MapView style={styles.map}>
            {marklist}
        </MapView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: '100%',
        height: '100%'
    }
})