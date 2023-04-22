import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './Profile';
import Home from './Home';
import CreateSuperBowl from './CreateSuperBowl';
import EateryMap from './EateryMap';
import COLORS from '../config/colorsPanel';

import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Panel({user, weather, time, setUser}) {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      activeColor='#68B3A3'
      barStyle={{ backgroundColor: '#fff' }}
    >
      {
      user.admin
      ?
      <Tab.Screen 
        name="CreateSuperBowl"  
        options={{ 
          title: 'Create Super Ball',
          headerStyle: {
            backgroundColor: COLORS.brandColor,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: '#fff',
          tabBarActiveTintColor: COLORS.brandColor,
          tabBarLabel: '', 
          tabBarIcon: ({color})=> (
            <Ionicons name="create" size={26} color={color} />
          )
        }} 
      >
        {(props)=><CreateSuperBowl {...props} user={user} />}
      </Tab.Screen>
      :
      <Tab.Screen 
        name="Home"  
        options={{ 
          title: 'Home',
          headerStyle: {
            backgroundColor: COLORS.brandColor,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: '#fff',
          tabBarActiveTintColor: COLORS.brandColor,
          tabBarLabel: '', 
          tabBarIcon: ({color})=> (
            <FontAwesome name="home" size={26} color={color} />
          )
        }} 
      >
        {(props)=><Home {...props} user={user} weather={weather} time={time} />}
      </Tab.Screen>
      }

      {
        user.admin
        ?
        <React.Fragment />
        :
        <Tab.Screen 
          name="EateryMap"  
          options={{ 
            headerStyle: {
              backgroundColor: COLORS.brandColor,
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTintColor: '#fff',
            tabBarActiveTintColor: COLORS.brandColor,
            tabBarLabel: '', 
            tabBarIcon: ({color})=> (
              <FontAwesome5 name="map-marked-alt" size={26} color={color} />
            )
          }} 
        >
          {(props)=><EateryMap {...props} user={user} weather={weather} time={time}/>}
        </Tab.Screen>
      }

      <Tab.Screen 
        name="Profile"  
        options={{ 
          headerStyle: {
            backgroundColor: COLORS.brandColor,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: '#fff',
          tabBarActiveTintColor: COLORS.brandColor,
          tabBarLabel: '', 
          tabBarIcon: ({color})=> (
            <FontAwesome name="user" size={26} color={color} />
          )
        }} 
      >
        {(props)=><Profile {...props} user={user} setUser={setUser} weather={weather} time={time}/>}
      </Tab.Screen>
    </Tab.Navigator>
  )
}
