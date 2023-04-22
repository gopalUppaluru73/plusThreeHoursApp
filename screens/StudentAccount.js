import React, {useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Pressable} from 'react-native';

import Btn from '../components/Btn';
import Input from '../components/Input';
import Padder from '../components/Padder';
import COLORS from '../config/colorsPanel';
import { MaterialIcons } from '@expo/vector-icons';

import {initializeApp} from 'firebase/app'
import {getDatabase, push, ref} from 'firebase/database';
import {
    createUserWithEmailAndPassword, getAuth, sendEmailVerification
} from 'firebase/auth';
import firebaseConfig from '../config/cred';
import Toast from 'react-native-root-toast';

import validators from '../config/validators';
const {createStudent} = validators;

export default function StudentAccount({navigation}) {
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState({name: '', email: '', password: ''})
    const [terms, setTerms] = useState(false)

    const onChange = obj => setValues({...values, ...obj})
    const gotoLogin = () => navigation.goBack()

    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const loginRef = ref(db, 'EateryLogin')

    const submit = () => {
        setLoading(true);
        const auth = getAuth()
        if(terms){
            const {status, message} = createStudent(values)
            if(status){
                createUserWithEmailAndPassword(auth, values.email, values.password)
                .then(userCredential=>{
                    push(loginRef, {name: values.name, email: values.email, admin:false})
                    .then(()=>{
                        sendEmailVerification(auth.currentUser)
                        .then(()=>{
                            setLoading(false)
                            Toast.show('Account created. Check your email verification link', {duration: Toast.durations.LONG})
                            gotoLogin()
                        })
                        .catch(()=>{
                            setLoading(false)
                            Toast.show('Failed to send email verification link', {duration: Toast.durations.LONG})
                            gotoLogin()
                        })
                    })
                })
                .catch(err=>{
                    const errmsg = err.message.split('/')[1].split(')')[0]
                    setLoading(false);
                    Toast.show(errmsg, {duration: Toast.durations.LONG})
                })
            }else{
                setLoading(false);
                Toast.show(message, {duration: Toast.durations.LONG})
            }
        }else{
            setLoading(false);
            Toast.show('Accept terms and conditions to register', {duration: Toast.durations.LONG})
        }
    }
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Create Student Account</Text>
                <Padder height={20} />
                <Input placeholder="Fullname" value={values.name} name="name" onChange={onChange} />
                <Padder />
                <Input placeholder="Enter email address" value={values.email} name="email" onChange={onChange} />
                <Padder />
                <Input placeholder="Enter password" value={values.password} name="password" onChange={onChange} secure />
                <Padder />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ marginRight: 10 }}>
                        {
                            terms
                            ?
                            <Pressable onPress={()=>setTerms(!terms)}>
                                <MaterialIcons name="check-box" size={24} color="dodgerblue" />
                            </Pressable>
                            :
                            <Pressable onPress={()=>setTerms(!terms)}>
                            <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
                            </Pressable>
                        }
                    </View>
                    <View>
                        <Text style={{ color: 'dodgerblue' }} onPress={()=>navigation.navigate('Terms')}>Terms and Conditions</Text>
                    </View>
                </View>
                <Btn title="Register" loading={loading} onPress={submit} />
                <Padder height={30} />
                <Text style={styles.description}>
                    Already have an account? <Text onPress={gotoLogin} style={styles.action}>Sign In</Text>
                </Text>
            </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    action: {
        color: COLORS.brandColor
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.brandColor
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