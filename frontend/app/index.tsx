import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/auth.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import FA from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';



export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);

 
  <View style={styles.logoContainer}>
    <Image
      source={require('../assets/images/santulan.png')}
      style={styles.logo}
      resizeMode="contain"
    />
    <Text style={styles.logoText}>SANTULAN</Text>
  </View>

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={22} color="#fff" />
        <Text style={styles.headerTitle}>Log In</Text>
        <View style={{ width: 22 }} />
      </View>
      
        <View style={styles.topCurve} />


      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.subtitle}>
          Start with us....
        </Text>

      
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="example@example.com"
          placeholderTextColor="#8ecae6"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="********"
            placeholderTextColor="#8ecae6"
            secureTextEntry={!passwordVisible}
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#8ecae6"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>Forget Password</Text>
        </TouchableOpacity>

        
       <TouchableOpacity
  style={styles.loginButton}
  onPress={() => router.replace('/(tabs)/profile')}
>
  <Text style={styles.loginText}>Log In</Text>
</TouchableOpacity>

        <Text style={styles.signup}>
          Don’t have an account? Contact your Doctor.
        </Text>
      </View>
    </SafeAreaView>
  );
}
