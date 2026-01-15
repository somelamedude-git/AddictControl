import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './pages/login';
import { navigationRef } from './utils/navigation';
import AddictHome from './pages/addicthome';
import FamHome from './pages/famhome';
import TestResults from './pages/testresults';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName='Login'>
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

        <Stack.Screen  
          name="TestR"
          component={TestResults}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
