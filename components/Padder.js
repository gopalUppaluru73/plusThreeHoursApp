import React from 'react'
import {View} from 'react-native'

export default function Padder({height}) {
  return (
    <View style={{ height: height ?? 10, width: '100%'}} />
  )
}
