import React from 'react'
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native'
import Padder from './Padder'

export default function SelectImage({image, onPress}) {
  return (
    <>
        <TouchableOpacity onPress={()=>onPress ? onPress() : null}>
            <View style={styles.img}>
                {image ? <Image source={{ uri: image }} style={styles.image} /> : <View />}
            </View>
        </TouchableOpacity>
        <Padder height={20} />
    </>
  )
}

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        borderRadius: 3
    },
    img: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        backgroundColor: 'rgba(155, 155, 155, 0.5)',
        borderRadius: 3
    }
})