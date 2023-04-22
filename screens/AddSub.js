import React, {useState, useEffect} from 'react'
import {View, SafeAreaView, StyleSheet, Image, Text, TouchableOpacity, StatusBar} from 'react-native'

import {initializeApp} from 'firebase/app'
import { getDatabase, ref, onValue, set } from 'firebase/database'
import firebaseConfig from '../config/cred'
import Padder from '../components/Padder'
import { Entypo } from '@expo/vector-icons';
import Btn from '../components/Btn'
import Toast from 'react-native-root-toast'
import COLORS from '../config/colorsPanel'

export default function AddSub({navigation, route, user, setUser}) {
    const [sbNum, setSBNum] = useState(0)
    const [sb, setSB] = useState([])
    const [userAcc, setUserAcc] = useState(user)
    const [acc, setAcc] = useState(null)
    const [num, setNum] = useState(0)
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)

    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dbref = ref(db, 'EateryAccount')
    const loginRef = ref(db, 'EateryLogin')

    useEffect(()=>{
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){ 
                const date = new Date().toLocaleDateString()
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.forEach(key=>arr.push({...data[key], ['id']: key}))
                
                const finalList = []
                arr.forEach(item=>{
                    if(item?.date){
                        if(item.date === date){
                            finalList.push(item)
                        }
                    }
                })
                const findEatery = finalList.find(item=>item.email === route.params?.email)
                if(findEatery){
                    setAcc(findEatery)
                    setImage(findEatery?.img ?? null)
                }
            }
        })
        onValue(loginRef, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.forEach(key => arr.push({...data[key], ['id']: key}))
                let findUser = arr.find(item=>item.email === userAcc.email)
                setUserAcc(findUser)
                setSB(findUser?.sb ?? [])
                if(findUser?.sb){
                    const date = new Date().toLocaleDateString()
                    const filterFindUserSB = findUser.sb.filter(item=>item.date === date)
                    if(filterFindUserSB.length > 0){
                        findUser['sb'] = filterFindUserSB
                    }else{
                        findUser['sb'] = []
                    }
                    let sum = 0
                    filterFindUserSB.forEach(item=>sum+=item.qty)
                    setSBNum(sum)
                    const filterCartNum = findUser.sb.find(item=>item.name === route.params?.name && item.date === date)
                    if(filterCartNum){
                        setNum(filterCartNum.qty)
                        setUser(findUser)
                    }else{
                        setUser(findUser)
                    }
                }
            }
        })
    }, [])

    const add = () => {
        if(acc?.sbnum){
            if(acc.sbnum > 0 && acc.sbnum > num){
                if(sbNum+1 <= 2 && num+1 <= 2){
                    setNum(num+1)
                    const date = new Date().toLocaleDateString()
                    userAcc['sb'] = userAcc['sb'] ? userAcc['sb'] : []
                    const findCart = userAcc['sb'].find(item=>item.name === acc.name)
                    if(findCart){
                        const newArr = userAcc['sb'].map(item=>{
                            if(item.name === acc.name){
                                item['date'] = date
                                item['qty'] += 1 
                            }
                            return item
                        })
                        userAcc['sb'] = newArr
                        acc['sbnum'] -= 1
                        set(ref(db, `EateryAccount/${acc.id}`), acc)
                        set(ref(db, `EateryLogin/${userAcc.id}`), userAcc)
                    }else{
                        userAcc['sb'] = [{name: acc.name, qty: 1, date}]
                        acc['sbnum'] -= 1
                        set(ref(db, `EateryAccount/${acc.id}`), acc)
                        set(ref(db, `EateryLogin/${userAcc.id}`), userAcc)
                    }
                }else{
                    Toast.show('You can only add two items from all superbowls available', {duration: Toast.durations.LONG})
                }
            }
        }
    }

    const minus = () => {
        if(num !== 0){
            setNum(num-1)
            const date = new Date().toLocaleDateString()
            userAcc['sb'] = userAcc['sb'] ? userAcc['sb'] : []
            const findCart = userAcc['sb'].find(item=>item.name === acc.name)
            if(findCart){
                const newArr = userAcc['sb'].map(item=>{
                    if(item.name === acc.name){
                        item['date'] = date
                        item['qty'] -= 1 
                    }
                    return item
                })
                userAcc['sb'] = newArr
                acc['sbnum'] += 1
                set(ref(db, `EateryAccount/${acc.id}`), acc)
                set(ref(db, `EateryLogin/${userAcc.id}`), userAcc)
            }else{
                userAcc['sb'] = [{name: acc.name, qty: 1, date}]
                acc['sbnum'] += 1
                set(ref(db, `EateryAccount/${acc.id}`), acc)
                set(ref(db, `EateryLogin/${userAcc.id}`), userAcc)
            }
        }
    }

    const submit = () => {
        setLoading(true)
        if(num > 0){
            console.log('initial', initialUserValue)
            console.log('current', userAcc)
            // const d = new Date().toLocaleDateString()
            // const superRefId = acc.id
            // const obj = {...acc, ['date']: d, sbnum: num}
            // const sendObj = {[superRefId]: obj}
            // set(dbref, sendObj)
            // .then(()=>{
            //     setLoading(false)
            //     Toast.show('Superbowl set for the day', {duration: Toast.durations.LONG})
            // })
            // .catch(()=>{
            //     setLoading(false)
            //     Toast.show('Error occurred while setting superbowl', {duration: Toast.durations.LONG})
            // });
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
            {/* <Padder height={30} />
            <View style={{ width: '80%', alignSelf: 'center' }}>
                <Btn title="Confirm Superbowl" bgColor="green" onPress={submit} loading={loading} />
            </View> */}
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
        alignItems: 'center',
        backgroundColor: COLORS.brandColor
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