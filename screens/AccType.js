import React from 'react'
import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native'
import Padder from '../components/Padder'
import Btn from '../components/Btn'
import COLORS from '../config/colorsPanel'

export default function AccType({navigation}) {
    const student = () => navigation.navigate('StudentLogin')
    const eatery = () => navigation.navigate('EateryLogin')
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.text}>Are you?</Text>
                <Padder height={30} />
                <Btn title="Eatery" bgColor="#4035de" onPress={eatery} />
                <Padder height={20} />
                <Btn title="Student" onPress={student} />
            </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.brandColor
    },
    form: {
        width: '80%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#E5E5E5'
    },
    text: {
        fontSize: 35,
        textAlign: 'center'
    }
})