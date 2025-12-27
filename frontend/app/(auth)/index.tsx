import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import styles from "../../styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color";
import { useAuthStore } from "../../store/authStore";
import { LinearGradient } from "expo-linear-gradient";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Added phone input
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
  if (!email || !phone || !password) {
    Alert.alert("Error", "Please enter email, phone, and password");
    return;
  }

 
  const result = await login(email, phone, password);

  if (!result.success) {
    Alert.alert("Error", result.error);
    return;
  }

  // Redirect based on role
  const role = result.user.role;
  if (role === "doctor") router.replace("/doctor");
  else if (role === "family") router.replace("/family");
  else router.replace("/(tabs)/profile");
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* ILLUSTRATION */}
        <View style={styles.topIllustration}>
          <Image
            source={require("../../assets/images/3.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
          
          <Text style={styles.topic}>SANTULAN</Text>
          
        </View>

        <View style={styles.card}>
          <View style={styles.formContainer}>
         
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone"
                  placeholderTextColor={COLORS.placeholderText}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

         
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

          
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

           
            <TouchableOpacity
  onPress={handleLogin}
  disabled={isLoading}
  activeOpacity={0.85}
  style={{ marginTop: 16 }} // keep spacing here
>
  <LinearGradient
    colors={['#52d4f5', '#28c3d7ff']}
    start={[0, 0]}
    end={[1, 1]}
    style={styles.button}
  >
    {isLoading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.buttonText}>Login</Text>
    )}
  </LinearGradient>
</TouchableOpacity>

          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
