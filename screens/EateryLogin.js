import React, {useState, useEffect} from 'react'
import {View, Text, SafeAreaView, StyleSheet, Alert} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';

import Btn from '../components/Btn'
import Input from '../components/Input'
import Padder from '../components/Padder'
import COLORS from '../config/colorsPanel'

import {initializeApp} from 'firebase/app'
import {getDatabase, ref, onValue} from 'firebase/database'
import {getAuth, sendEmailVerification, signInWithEmailAndPassword} from 'firebase/auth'
import firebaseConfig from '../config/cred'
import Toast from 'react-native-root-toast';

import validators from '../config/validators';
const {checkLogin} = validators;

export default function EateryLogin({navigation, setUser}) {
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState({email: '', password: ''})
    const [eateryLogin, setEateryLogin] = useState([])

    const onChange = obj => setValues({...values, ...obj})
    const gotoAccount = () => navigation.navigate('EateryAccount')

    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const loginRef = ref(db, 'EateryLogin')

    useEffect(()=>{
        onValue(loginRef, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.map(key=>{
                    let obj = data[key]
                    obj['id'] = key
                    arr.push(obj)
                })
                setEateryLogin(arr)
            }
        })
    }, [])

    const storeData = async(data, key) => {
        try{
            await AsyncStorage.setItem(key, data)
        }catch(e){
            Toast.show('Error occurred while saving data locally', {duration: Toast.durations.LONG})
        }
    }

    const sendLink = auth => {
        sendEmailVerification(auth.currentUser)
        .then(()=>{
            setLoading(false)
            Toast.show('Email verification link sent', {duration: Toast.durations.LONG})
        })
        .catch((err)=>{
            setLoading(false)
            Toast.show('Failed to send email verification link', {duration: Toast.durations.LONG})
        })
    }

    const submit = async() => {
        setLoading(true);
        const auth = getAuth();
        const {status, message} = checkLogin(values)
        if(status){
            signInWithEmailAndPassword(auth, values.email, values.password)
            .then(userCredential=>{
                if(userCredential.user.emailVerified){
                    const findUser = eateryLogin.find(user=>user.email === values.email)
                    storeData(JSON.stringify(findUser), 'superbowl-user')
                    .then(()=>{
                        setLoading(false);
                        setUser(findUser)
                        navigation.navigate('Panel')
                    })
                    .catch(()=>{
                        setLoading(false)
                        setUser(findUser)
                        Toast.show('Failed to store data locally', {duration: Toast.durations.LONG})
                        navigation.navigate('Panel')
                    })
                }else{
                    const msg = 'Your email is not verified. Do you want to send a new email verification link?'
                    Alert.alert('Error', msg, [
                        {text: 'YES', onPress:()=>sendLink(auth)},
                        {text: 'NO', onPress:()=>setLoading(false)}
                    ])
                }
            })
            .catch(err=>{
                const errmsg = err.message.split('/')[1].split(')')[0]
                setLoading(false)
                Toast.show(errmsg, {duration: Toast.durations.LONG})
            })
        }else{
            setLoading(false);
            Toast.show(message, {duration: Toast.durations.LONG})
        }
    }
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Login to Account</Text>
                <Padder height={20} />
                <Input placeholder="Enter email address" value={values.email} name="email" onChange={onChange} />
                <Padder />
                <Input placeholder="Enter password" value={values.password} name="password" onChange={onChange} secure />
                <Padder />
                <Btn title="Login" loading={loading} onPress={submit} />
                <Padder height={30} />
                <Text style={styles.description}>
                    Don't have an account? <Text onPress={gotoAccount} style={styles.action}>Sign Up</Text>
                </Text>
            </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    action: {
        color: "#30a2c3"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#30a2c3'
    },
    description: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    form: {
        width: '80%',
        borderRadius: 3,
        padding: 10,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})