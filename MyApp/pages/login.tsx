import { View, TextInput, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAuthStore } from "../utils/state_utils/zust";

const LoginPage = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const nav = async () => {
      try {
        const role = await AsyncStorage.getItem('role')
        if (role?.toLowerCase() === 'addict')
          navigation.replace('AddictH')
        else if (role?.toLowerCase() === 'family')
          navigation.replace('FamH')
      } catch (err) {
        console.log(err)
      }
    }

    nav()
  }, [])

  const handleChange = (field: any, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        phone: formData.phone,
        email: formData.email,
        password: formData.password
      });

      await AsyncStorage.setItem("accessToken", response.data.accessToken);
      useAuthStore.setState({ accessToken: response.data.accessToken });
      await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
      await AsyncStorage.setItem("role", response.data.role);

      console.log("Login success:", response.data);
      const role = response.data.role
      if (role.toLowerCase() === 'addict')
        navigation.replace('AddictH')
      else if (role.toLowerCase() === 'family')
        navigation.replace('FamH')

    } catch (err: any) {
      console.log("Login failed:", err);
    }
  };

  return (
    <ImageBackground
      source={require('../components/assets/images/SANTULAN.png')}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.topSpacer} />

        <View style={styles.bottomSheet}>
          <ScrollView contentContainerStyle={styles.scrollContent}>

            <Text style={styles.title}>Welcome back</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="1234567890"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="kristin.watson@example.com"
                placeholderTextColor="#ccc"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••••"
                placeholderTextColor="#ccc"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
              />
            </View>

            <View style={styles.forgotRow}>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>


            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
              <Text style={styles.loginButtonText}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('Registration')}>
              <Text style={styles.createAccountText}>Don't have an account? <Text style={styles.signUpText}>Sign up</Text></Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSpacer: {
    flex: 0.2,
  },
  bottomSheet: {
    flex: 0.8,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4A61AF',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputLabel: {
    fontSize: 12,
    color: '#636e72',
    fontWeight: '600',
    marginBottom: 2,
  },
  input: {
    fontSize: 16,
    color: '#2d3436',
    padding: 0,
    height: 24,
  },
  forgotRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#4A61AF',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: "#4A61AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  createAccountButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  createAccountText: {
    color: '#636e72',
    fontSize: 14,
  },
  signUpText: {
    color: '#4A61AF',
    fontWeight: '700',
  },
});

export default LoginPage;
