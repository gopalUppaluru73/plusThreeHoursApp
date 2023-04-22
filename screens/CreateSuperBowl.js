import React, {useState, useEffect} from 'react'
import {View, SafeAreaView, StyleSheet, StatusBar, Image, Text, TouchableOpacity} from 'react-native'

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set } from 'firebase/database'
import firebaseConfig from '../config/cred'
import Padder from '../components/Padder'
import { Entypo } from '@expo/vector-icons';
import Btn from '../components/Btn'
import Toast from 'react-native-root-toast'

export default function CreateSuperBowl({navigation, user}) {
    const [acc, setAcc] = useState(null)
    const [image, setImage] = useState('')
    const [num, setNum] = useState(0)
    const [loading, setLoading] = useState(false)

    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dbref = ref(db, 'EateryAccount')

    useEffect(()=>{
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.forEach(key=>arr.push({...data[key], ['id']: key}))
                const findSuper = arr.find(item=>item.email === user.email)
                if(findSuper){
                    setImage(findSuper.img)
                    setAcc(findSuper)
                    setNum(findSuper?.sbnum ?? 0)
                }
            }
        })
    }, [])

    const add = () => setNum(num+1)

    const minus = () => {
        if(num !== 0){
            setNum(num-1)
        }
    }

    const submit = () => {
        setLoading(true)
        if(num > 0){
            const d = new Date().toLocaleDateString()
            const superRefId = acc.id
            const obj = {...acc, ['date']: d, sbnum: num}
            set(ref(db, `EateryAccount/${acc.id}`), obj)
            .then(()=>{
                setLoading(false)
                Toast.show('Superbowl set for the day', {duration: Toast.durations.LONG})
            })
            .catch(()=>{
                setLoading(false)
                Toast.show('Error occurred while setting Superbowl', {duration: Toast.durations.LONG})
            });
        }else{
            setLoading(false)
            Toast.show('Superbowl must be at least 1 to confirm.', {duration: Toast.durations.LONG})
        }
    }
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#68B3A3" />
        <View style={styles.container}>
            <Padder height={30} />
            <View style={styles.logoview}>
                {image ? <Image source={{ uri: image }} style={styles.img} /> : <React.Fragment />}
            </View>
            <View style={{ width: '80%', alignSelf: 'center' }}>
                <Text style={styles.title}>{acc?.name ?? ''}</Text>
            </View>
            <Padder height={20} />
            <View style={{ width: '80%', alignSelf: 'center' }}>
                <View style={styles.buttonview}>
                    <View style={styles.buttonLeft}>
                        <TouchableOpacity onPress={minus}>
                            <View style={styles.buttonLeftView}>
                                <Entypo name="minus" size={24} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonMiddle}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>{num}</Text>
                    </View>
                    <View style={styles.buttonRight}>
                        <TouchableOpacity onPress={add}>
                            <View style={styles.buttonRightView}>
                                <Entypo name="plus" size={24} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Padder height={30} />
            <View style={{ width: '80%', alignSelf: 'center' }}>
                <Btn title="Confirm Superbowl" bgColor="green" onPress={submit} loading={loading} />
            </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    buttonLeft: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        alignItems: 'center',
        backgroundColor: '#3f9be3'
    },
    buttonLeftView: {
        padding: 10,
    },
    buttonRight: {
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
        backgroundColor: 'dodgerblue',
        alignItems: 'center'
    },
    buttonRightView: {
        padding: 10,
    },
    buttonMiddle: {
        flex: 3,
        padding: 10
    },
    buttonview: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        flexDirection: 'row'
    },
    container: {
        flex: 1
    },
    img: {
        width: 130, 
        height: 130, 
        borderRadius: 3
    },
    logoview: {
        width: 130, 
        height: 130, 
        borderRadius: 3, 
        backgroundColor: '#ccc',
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
        alignSelf: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 27,
        textAlign: 'center'
    }
})