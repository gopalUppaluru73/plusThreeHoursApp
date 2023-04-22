import React, {useEffect} from 'react'
import {SafeAreaView, View, StyleSheet} from 'react-native'
import QRCode from 'react-native-qrcode-svg';

export default function BarCode({navigation, route, user}) {
    useEffect(()=>{
        // console.log(route.params)
        // console.log(user)
    }, [])
  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
            <View>
                <QRCode size={200} value={JSON.stringify({cart: route.params, user})} />
            </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    safe: {
        flex: 1
    }
})