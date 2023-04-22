import React, {useEffect, useState} from 'react'
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, StatusBar
} from 'react-native'

import {initializeApp} from 'firebase/app'
import {getDatabase, ref, onValue} from 'firebase/database'
import firebaseConfig from '../config/cred'

import Toast from 'react-native-root-toast'

export default function Home({navigation, user, weather, time}) {
  const [eatery, setEatery] = useState([])
  const app = initializeApp(firebaseConfig)
  const db = getDatabase(app)
  const dbref = ref(db, 'EateryAccount')

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
        const date = new Date().toLocaleDateString()
        const data = snapshot.val()
        const keys = Object.keys(data)
        const arr = []
        keys.forEach(key => arr.push({...data[key], ['id']: key}))
        
        const finalList = []
        arr.forEach(item=>{
          if(item?.date){
            if(item.date === date){
              finalList.push(item)
            }
          }
        })
        setEatery(finalList)
      }
    })
  }, [])

  const openEatery = item => {
    if(item?.sbnum && item.sbnum > 0){
      const d = new Date()
      if(item.date === d.toLocaleDateString()){
        if(d.getHours() >= 18 && d.getHours() < 21){
          navigation.navigate('AddSub', item)
        }else{
          Toast.show('Superbowl is only available betweens the hours of 18-21', {duration: Toast.durations.LONG})
        }
      }else{
        Toast.show(`No available Superbowl from ${item.name} today`, {duration: Toast.durations.LONG})
      }
    }else{
      Toast.show('No available Superbowl', {duration: Toast.durations.LONG})
    }
  }

  const listItems = eatery.length === 0 ? <View /> : eatery.map((item, index)=>{
    return (
      <View style={styles.rowItem} key={item.id}>
        <TouchableOpacity onPress={()=>openEatery(item)}>
          <View style={styles.rowview}>
            <View style={styles.img}>
              <Image source={{ uri: item.img }} style={styles.image} />
            </View>
            <View>
              <Text style={styles.rowItemText}>{item.name}</Text>
              <Text style={styles.superText}>Superbowls: <Text>{item?.sbnum ?? 0}</Text></Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.row}>{listItems}</View>
      </ScrollView>
      <StatusBar backgroundColor="#68B3A3" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    img: { 
      width: '100%', 
      height: 150,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      overflow: 'hidden',
      padding: 5,
      backgroundColor: 'transparent'
    },
    image: {
      width: '100%',
      height: 150
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 10
    },
    rowItem: {
      width: '48%',
      padding: 10
    },
    rowItemText: { 
      textAlign: 'center', 
      fontSize: 20,
      paddingTop: 10, 
    },
    rowview: {
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      marginBottom: 5
    },
    superText: {
      marginTop: 5,
      marginBottom: 5,
      paddingLeft: 10
    }
})