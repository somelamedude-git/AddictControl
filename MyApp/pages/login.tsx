import { View, TextInput } from "react-native"
import { Button } from "react-native";
import { useState } from "react";

const LoginPage = () => {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View>
        <TextInput placeholder="Phone" onChangeText={text => setPhone(text)} value={phone} keyboardType="numeric"/>
        <TextInput placeholder="Email" onChangeText={text => setEmail(text)} value={email}/>
        <TextInput placeholder="Password" onChangeText={text => setPassword(text)} value={password} secureTextEntry={true}/>
        <Button title="Login"/>
        </View>
    )
}

export default LoginPage;