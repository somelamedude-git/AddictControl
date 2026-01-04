import { View, TextInput } from "react-native"
import { Button } from "react-native";
import { useState } from "react";
import axios from "axios";
import { ip } from "../creds";
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginPage = () => {
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        password: ''    
    });

    const handlechange = (event: any) => {
        const { name, value } = event.target;
        setFormData((formData) => ({
            ...formData,
            [name]: value
        }));
    }

    const handlesubmit = async (event: any) => {
        try {
            event.preventDefault()

            const response = await axios.post(`http://${ip}:5000/login`, {
                phone: formData.phone,
                email: formData.email,
                password: formData.password
            })

            AsyncStorage.setItem('refreshToken', response.data.refreshToken);
            AsyncStorage.setItem('accessToken', response.data.accessToken);
            AsyncStorage.setItem('role', response.data.role);

            //navigtion based on user role (to be done when other pages  are added)
            console.log(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <View>
        <TextInput placeholder="Phone" onChangeText={handlechange} value={formData.phone} keyboardType="numeric"/>
        <TextInput placeholder="Email" onChangeText={handlechange} value={formData.email}/>
        <TextInput placeholder="Password" onChangeText={handlechange} value={formData.password} secureTextEntry={true}/>
        <Button title="Login" onPress={handlesubmit}/>
        </View>
    )
}

export default LoginPage;