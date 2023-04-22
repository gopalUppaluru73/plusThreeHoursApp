import React, {useState, useEffect} from 'react'
import {View, Text, SafeAreaView, StyleSheet} from 'react-native'

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import Btn from '../components/Btn'
import Input from '../components/Input'
import Padder from '../components/Padder'
import COLORS from '../config/colorsPanel'

import {initializeApp} from 'firebase/app'
import {getDatabase, push, ref} from 'firebase/database'
import {createUserWithEmailAndPassword, getAuth, sendEmailVerification} from 'firebase/auth'
import {getStorage, ref as storageRef, getDownloadURL, uploadBytes} from 'firebase/storage'
import firebaseConfig from '../config/cred'
import SelectImage from '../components/SelectImage';
import Toast from 'react-native-root-toast';

import validators from '../config/validators';
const {createEatery} = validators;

export default function EateryAccount({navigation}) {
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState({name: '', email: '', password: ''})
    const [image, setImage] = useState(null)
    const [latlon, setLatLon] = useState(null)

    const onChange = obj => setValues({...values, ...obj})
    const gotoLogin = () => navigation.goBack()

    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dbref = ref(db, 'EateryAccount')
    const loginRef = ref(db, 'EateryLogin')
    const storage = getStorage(app)

    const reqLocation = async() => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
          setErrMsg('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLatLon({latitude: location?.coords?.latitude ?? null, longitude: location?.coords?.longitude ?? null})
    }

    useEffect(()=>{
        reqLocation()
    }, [])

    const pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
      
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const clearForm = () => {
        setValues({name: '', email: '', password: ''})
        setImage(null)
    }

    const submit = async() => {
        setLoading(true);
        const auth = getAuth();
        const {status, message} = createEatery(values)
        if(status){
            if(image){
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                    resolve(xhr.response);
                    };
                    xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", image, true);
                    xhr.send(null);
                })
                const obj = {name: values.name, email: values.email}
                const acc = {...obj, admin: true}

                const rand = Math.floor(Math.random() * 1000000000)
                const sref = storageRef(storage, `superbowl/image${rand}`)

                createUserWithEmailAndPassword(auth, values.email, values.password)
                .then(userCredential=>{
                    uploadBytes(sref, blob).then((snapshot)=>{
                        getDownloadURL(snapshot.ref).then(url=>{
                            const item = {...obj, img: url, ...latlon}
                            push(dbref, item)
                            .then(()=>{
                                push(loginRef, acc)
                                .then(()=>{
                                    sendEmailVerification(auth.currentUser)
                                    .then(()=>{
                                        setLoading(false);
                                        clearForm()
                                        Toast.show('Account created. Check your email for verification', {duration: Toast.durations.LONG})
                                    })
                                    .catch(()=>{
                                        setLoading(false);
                                        Toast.show('Account created but failed to send email verification', {duration: Toast.durations.LONG})
                                    });
                                })
                                .catch(()=>{
                                    setLoading(false);
                                    Toast.show('Failed to create login account', {duration: Toast.durations.LONG})
                                });
                            })
                            .catch(()=>{
                                setLoading(false);
                                Toast.show('Failed to create account', {duration: Toast.durations.LONG})
                            });
                        })
                    })
                })
                .catch(err=>{
                    const errmsg = err.message.split('/')[1].split(')')[0];
                    setLoading(false);
                    Toast.show(errmsg, {duration: Toast.durations.LONG})
                })
            }else{
                setLoading(false);
                Toast.show('Logo upload is required', {duration: Toast.durations.LONG})
            }
        }else{
            setLoading(false);
            Toast.show(message, {duration: Toast.durations.LONG})
        }
    }
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Create Eatery Account</Text>
                <Padder height={20} />
                <SelectImage image={image} onPress={pickImage} />
                <Input placeholder="Eatery Name" value={values.name} name="name" onChange={onChange} />
                <Padder />
                <Input placeholder="Enter email address" value={values.email} name="email" onChange={onChange} />
                <Padder />
                <Input placeholder="Enter password" value={values.password} name="password" onChange={onChange} secure />
                <Padder />
                <Btn title="Register" loading={loading}  bgColor="#4035de" onPress={submit} />
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
        color: COLORS.brandColor,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.brandColor
    },
    description: {
        textAlign: 'center',
    },
    form: {
        width: '80%',
        borderRadius: 10,
        padding: 15,
        backgroundColor: COLORS.white
    },
    title: {
        fontSize: 16,
    }
})