import React, {useRef,useEffect} from 'react'
import {LogBox} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Context from '../config/Context';
import * as Analytics from "expo-firebase-analytics";

import AppMap from '../screens/AppMap';
import Home from '../screens/Home';
import Welcome from '../screens/Welcome';
import AccType from '../screens/AccType';
import EateryAccount from '../screens/EateryAccount';
import EateryLogin from '../screens/EateryLogin';
import StudentAccount from '../screens/StudentAccount';
import StudentLogin from '../screens/StudentLogin';
import Panel from '../screens/Panel';
import AddSub from '../screens/AddSub';
import BarCode from '../screens/BarCode';
import AdminScan from '../screens/AdminScan';
import Terms from '../screens/Terms';

const StackNavigator = createNativeStackNavigator()

export default function AppNav() {
  useEffect(()=>{
    LogBox.ignoreAllLogs()
  }, [])

  const navigationRef = useRef();
  const routeNameRef = useRef();
  return (
    <Context.Consumer>
      {(context)=>(
        <NavigationContainer
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
        }
        onStateChange={ async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
          if (previousRouteName !== currentRouteName) {
            await Analytics.logEvent("screen_view", {
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          // Save the current route name for later comparison
          routeNameRef.current = currentRouteName;
        }}
        >
          <StackNavigator.Navigator>
            <StackNavigator.Screen name="Welcome" options={{ headerShown: false }}>
              {(props) => <Welcome {...props} setLatLon={context.setLatLon} weather={context.weather} time={context.time} weatherInfo={context.weatherInfo} /> }
            </StackNavigator.Screen>
            <StackNavigator.Screen name="Map" component={AppMap} options={{ headerShown: false }} />
            <StackNavigator.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <StackNavigator.Screen name="AccType" component={AccType} options={{ headerShown: false }} />
            <StackNavigator.Screen name="EateryAccount" options={{ headerShown: false }}>
              {(props)=><EateryAccount {...props} />}
            </StackNavigator.Screen>
            <StackNavigator.Screen name="EateryLogin" options={{ headerShown: false }}>
              {(props)=><EateryLogin {...props} setUser={context.setUser}/>}
            </StackNavigator.Screen>
            <StackNavigator.Screen name="StudentLogin" options={{ headerShown: false }}>
              {(props)=><StudentLogin {...props} setUser={context.setUser}/>}
            </StackNavigator.Screen>
            <StackNavigator.Screen name="StudentAccount" options={{ headerShown: false }}>
              {(props)=><StudentAccount {...props} />}
            </StackNavigator.Screen>
            <StackNavigator.Screen name="Panel" options={{ headerShown: false }}>
              {(props)=><Panel {...props} setUser={context.setUser} user={context.user} weather={context.weather} time={context.time}/>}
            </StackNavigator.Screen>
            <StackNavigator.Screen
              name="AddSub" 
              options={{ 
                title: 'Add A Superbowl',
                headerStyle: {
                  backgroundColor: '#30a2c3',
                },
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerTintColor: '#fff',
              }}
            >
              {(props)=><AddSub {...props} user={context.user} setUser={context.setUser}/>}
            </StackNavigator.Screen>
            <StackNavigator.Screen
              name="BarCode" 
              options={{ 
                title: 'Superbowl Barcode',
                headerStyle: {
                  backgroundColor: '#30a2c3',
                },
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerTintColor: '#fff',
              }}
            >
              {(props)=><BarCode {...props} user={context.user} />}
            </StackNavigator.Screen>
            <StackNavigator.Screen name="AdminScan" component={AdminScan} options={{ headerShown: false }} />
            <StackNavigator.Screen 
              name="Terms" 
              component={Terms} 
              options={{
                title: 'Terms and Conditions'
              }} 
            />
          </StackNavigator.Navigator>
        </NavigationContainer>
      )}
    </Context.Consumer>
  )
}
