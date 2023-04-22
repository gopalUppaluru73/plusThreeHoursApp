import React from 'react'
import {View, TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native'

export default function Btn({title, bgColor, onPress, loading}) {
    if(!loading){
        return (
            <TouchableOpacity onPress={()=>onPress ? onPress() : null}>
                <View style={[styles.button, {backgroundColor: bgColor ?? styles.button.backgroundColor}]}>
                    <Text style={styles.text}>{title ?? 'Button'}</Text>
                </View>
            </TouchableOpacity>
        )
    }
  return (
    <TouchableOpacity onPress={()=>onPress ? onPress() : null}>
        <View style={[styles.button, {backgroundColor: bgColor ?? styles.button.backgroundColor}]}>
            {
                loading 
                ?
                <ActivityIndicator size="large" color="white" />
                :
                <Text style={styles.text}>{title ?? 'Button'}</Text> 
            }
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'dodgerblue',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3,
        margin: 5,
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    }
})