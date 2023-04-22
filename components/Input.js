import React from 'react'
import {View, TextInput, StyleSheet} from 'react-native'

export default function Input({onChange, name, value, placeholder, secure}) {
  return (
    <View style={styles.container}>
        <TextInput 
            style={styles.textInput}
            value={value ?? ''} 
            placeholder={placeholder ?? ''}
            onChangeText={text=>onChange({[name]: text})} 
            secureTextEntry={secure ?? false}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginBottom: 5
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
        backgroundColor: '#fff',
        padding: 8
    }
})