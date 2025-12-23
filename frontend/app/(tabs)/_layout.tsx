import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';


const _layout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'home') iconName = 'home';
          else if (route.name === 'test') iconName = 'clipboard';
          else if (route.name === 'profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00bcd4',
        tabBarInactiveTintColor: 'gray',
      })}>
        <Tabs.Screen name="test" options={{ title: 'Test' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        
       
    </Tabs>
  )
}

export default _layout