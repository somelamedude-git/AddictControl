import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './pages/login';
import { navigationRef } from './utils/navigation';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './utils/intercept';
import AddictHome from './pages/addicthome';
import FamHome from './pages/famhome';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialroute, setinitialroute] = useState('Login')

  useEffect(() => {
    const bootstrapauth = async() => {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken')

        if(!refreshToken)
          return

        const response = await apiClient.post('/refresh', {
          refreshToken
        })

        await AsyncStorage.setItem('accessToken', response.data.accessToken)
        const role = await AsyncStorage.getItem('role')

        if(!role)
          return

        if(role.toLowerCase() === 'addict') {
          setinitialroute('AddictH')
          return
        }
        setinitialroute('FamH')

      } catch (err) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken'])
        console.log('Not logged in')
      }
    }
    bootstrapauth()
  }, [])

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialroute}>
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddictH"
          component={AddictHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FamH"
          component={FamHome}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
