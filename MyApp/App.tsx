import 'react-native-gesture-handler'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './pages/login';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ip } from './creds';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialrouteName, setinitialRouteName] = useState<string>("Login");

  useEffect(() => {
    const decideinitialRoute = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if(!refreshToken) {
          return "Login";
        } else {
          const response = await axios.post(`http://${ip}:5000/checklogin`, {
            refreshToken 
          })

          if(response.data.success) {
            //navigation based on user roles (to be done when other pages are added)
            return "SomeOtherPage";
          }
          return "Login";
        }
      } catch(err) {
        console.log(err)
        return "Login";
      }
    }
    decideinitialRoute().then(route => setinitialRouteName(route));
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialrouteName}>
        <Stack.Screen name="Login" component={LoginPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
