import { View, TextInput, Button } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../utils/intercept";

const LoginPage = ({navigation}: any) => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const nav = async() => {
      try {
        const role = await AsyncStorage.getItem('role')
        if (role?.toLowerCase() === 'addict')
          navigation.navigate('AddictH')
        else if(role?.toLowerCase() === 'family')
          navigation.navigate('FamH')
      } catch (err) {
        console.log(err)
      }
    }

    nav()
  }, [])

  const handleChange = (field:any, value:any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await apiClient.post("/login", {
        phone: formData.phone,
        email: formData.email,
        password: formData.password
      });

      await AsyncStorage.setItem("accessToken", response.data.accessToken);
      await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
      await AsyncStorage.setItem("role", response.data.role);

      console.log("Login success:", response.data);
      // navigation will be added later

    } catch (err:any) {
      console.log("Login failed:", err.response?.data || err.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Phone"
        keyboardType="numeric"
        value={formData.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />

      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <Button title="Login" onPress={handleSubmit} />
    </View>
  );
};

export default LoginPage;
