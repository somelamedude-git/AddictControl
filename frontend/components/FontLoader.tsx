import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { View, ActivityIndicator } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export default function FontLoader({ children }: Props) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'JenWagner': require('../assets/fonts/myfont.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
