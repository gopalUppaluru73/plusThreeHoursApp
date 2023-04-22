import React, {useState, useEffect} from 'react';
import {
    View, SafeAreaView, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, Image, Button
} from 'react-native';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import Padder from '../components/Padder'
import COLORS from '../config/colorsPanel';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import firebaseConfig from '../config/cred';

export default function Profile({navigation, user, setUser, route, weather}) {
    const [userAcc, setUserAcc] = useState(user)
    const [sb, setSB] = useState([])
    const [superBowl, setSuperBowl] = useState(false)
    const [sbCount, setSBCount] = useState(0)
    
    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dbref = ref(db, 'EateryLogin')

    useEffect(()=>{
        navigation.setOptions({
            headerRight: ()=>(
                <>
                {
                    user.admin 
                    ?
                    <TouchableOpacity onPress={scan} style={{ padding: 10, marginRight: 10 }}>
                        <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
                    </TouchableOpacity>
                    :
                    <React.Fragment />
                }
                </>
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
        // setSB(user?.sb ?? [])
        onValue(dbref, snapshot=>{
            if(snapshot.exists()){
                const data = snapshot.val()
                const keys = Object.keys(data)
                const arr = []
                keys.forEach(key=>arr.push({...data[key], ['id']: key}))
                let findUser = arr.find(item=>item.email === user.email)
                if(findUser){
                    const date = new Date().toLocaleDateString()
                    findUser['sb'] = findUser['sb'] ? findUser['sb'] : []
                    const filterSb = findUser['sb'].filter(item=>item.date === date)
                    findUser['sb'] = filterSb
                    let c = 0
                    findUser['sb'].forEach(item=>c += item.qty)
                    setSBCount(c)

                    setSB(findUser['sb'] ?? [])
                    setUserAcc(findUser)
                    setUser(findUser)
                }
            }
        })
        
        if(route.params?.success){
            Toast.show('Successful scan. You can pick up your order', {duration: Toast.durations.LONG})
            // console.log('success', route.params)
        }
    }, [])

    const scan = () => {
        if(user.admin){
            navigation.navigate('AdminScan')
        }
    }

    const goToBarCode = item => navigation.navigate('BarCode', item)

    const renderItem = ({item}) => {
        return (
            <View style={{ marginBottom: 7 }}>
                <TouchableOpacity onPress={()=>goToBarCode(item)}>
                    <View style={{ borderRadius: 3, flexDirection: 'row', alignItems: 'center', padding: 5, backgroundColor: '#fff', borderWidth:1, borderColor: '#ccc'}}>
                        <View style={{ width: '90%', borderRightWidth:1, borderRightColor: '#ccc'}}>
                            <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 17 }}>{item.name}</Text>
                        </View>
                        <View style={{ padding: 5, width: '10%', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{item.qty}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const toggleSuperBowl = () => setSuperBowl(!superBowl)

    const logout = async() => {
        try{
            await AsyncStorage.removeItem('superbowl-user')
            .then(()=>{
                navigation.navigate('AccType')
            })
        }catch(e){
            //
        }
    }
    // console.log(user)
  return (
    <SafeAreaView style={{ flex:1 }}>
        <StatusBar backgroundColor="#68B3A3" />
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.icon}>
                    <FontAwesome name="user" size={50} color="white" />
                </View>
                <View style={{ padding: 10 }}>
                    <Text numberOfLines={2} style={{ fontSize: 18, fontWeight: 'bold' }}>{user.name}</Text>
                </View>
            </View>
            <View style={styles.body}>
                <Padder height={15} />
                
                {user.admin
                ?
                <React.Fragment></React.Fragment>
                :
                <TouchableOpacity style={{ marginBottom: 10 }} onPress={toggleSuperBowl}>
                    <View style={styles.bodyRow}>
                        <View>
                            <Ionicons name="fast-food" size={24} color="#68B3A3" />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 20 }}>My Superbowl</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                }

                {
                    user.admin 
                    ?
                    <View />
                    :
                    <>
                        {
                            superBowl
                            ?
                            <>
                            {
                            sbCount === 0
                            ?
                            <View />
                            :
                            <View style={{ width: '80%', alignSelf: 'center', marginTop: 10 }}>
                                <FlatList data={sb} renderItem={renderItem} keyExtractor={item=>item?.name} />
                            </View>
                            }
                            </>
                            :
                            <View />
                        }
                    </>
                }

                {sb.length === 0 ? <View /> : <Padder height={20} />}

                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <View style={styles.bodyRow}>
                        <View>
                            <MaterialIcons name="logout" size={24} color="#68B3A3" />
                        </View>
                        <View style={{ marginLeft: 0 }}>
                            <Text style={{ fontSize: 22, color: COLORS.white }}>Logout</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        padding: 20
    },
    bodyRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 70,
        height: 70,
        backgroundColor: COLORS.brandColor,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center'
    },
    logoutBtn: {
        backgroundColor: COLORS.brandColor,
        width: 300,
        height: 50,
        paddingTop: 10,
        paddingLeft: 90,
        borderRadius: 15,
        color: COLORS.white,
        marginTop: 320,
        marginLeft: 30
    }
})