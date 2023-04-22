import React from 'react'
import {View, Text, FlatList, SafeAreaView, StyleSheet} from 'react-native'

import data from '../config/data'

export default function Terms({navigation}) {
    const renderItem = ({item}) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ marginRight: 5, fontWeight: 'bold' }}><Text>{item.id}</Text></View>
                <View><Text>{item.text}</Text></View>
            </View>
        )
    }
  return (
    <SafeAreaView style={{ flex:1 }}>
        <View style={styles.container}>
            <View style={{ padding: 10 }} />
            <FlatList data={data} renderItem={renderItem} keyExtractor={item=>item.id} />
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '95%',
        alignSelf: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    }
})