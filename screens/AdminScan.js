import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import {initializeApp} from 'firebase/app'
import {getDatabase, ref, set, onValue} from 'firebase/database'
import firebaseConfig from '../config/cred';

export default function AdminScan({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [allAcc, setAllAcc] = useState([])
    const [allUserAcc, setAllUserAcc] = useState([])

    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dbref = ref(db, 'EateryAccount')
    const loginRef = ref(db, 'EateryLogin')

    useEffect(() => {
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.forEach(key=>arr.push({...data[key], ['id']: key}))
                setAllAcc(arr)
            }
        })

        onValue(loginRef, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.forEach(key=>arr.push({...data[key], ['id']: key}))
                setAllUserAcc(arr)
            }
        })

        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        const obj = JSON.parse(data)
        const {cart, user} = obj;
        const findAcc = allAcc.find(item=>item.name === cart.name)
        const findUser = allUserAcc.find(item=>item.email === user.email)
        if(findUser){
            const newArr = findUser.sb.map(item=>{
                if(item.name === findAcc.name){
                    item.qty = 0
                }
                return item
            })
            findUser['sb'] = newArr
            set(ref(db, `EateryLogin/${findUser.id}`), findUser)
            .then(()=>{
                navigation.navigate('Profile', {success: 'success'})
            })
        }
    };
    
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})