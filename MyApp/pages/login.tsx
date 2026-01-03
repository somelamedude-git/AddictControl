import { View, TextInput } from "react-native"
import { Button } from "react-native";
import { useState } from "react";
import axios from "axios";
import { ip } from "../creds";
import AsyncStorage from '@react-native-async-storage/async-storage'

const LoginPage = () => {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submitlogin = async () => {
        try {
            const response = await axios.post(`http://${ip}:5000/login`, {
                phone, email, password
            })

            const {role, refreshToken, accessToken} = response.data;
            AsyncStorage.setItem('refreshToken', refreshToken);
            AsyncStorage.setItem('accessToken', accessToken);
            AsyncStorage.setItem('role', role);
            console.log(response.data)

            //navigation based on user roles (to be done when other pages are added)---this comment is not written by ai (irritated face emoji)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <View>
        <TextInput placeholder="Phone" onChangeText={text => setPhone(text)} value={phone} keyboardType="numeric"/>
        <TextInput placeholder="Email" onChangeText={text => setEmail(text)} value={email}/>
        <TextInput placeholder="Password" onChangeText={text => setPassword(text)} value={password} secureTextEntry={true}/>
        <Button title="Login" onPress={submitlogin}/>
        </View>
    )
}

export default LoginPage;