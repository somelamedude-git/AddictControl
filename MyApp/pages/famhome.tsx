import { View, Text } from "react-native";
import Requesttest from "../components/requesttest";
import Logoutcomp from "../components/logout";
import { useEffect, useState } from "react";
import apiClient from "../utils/intercept";
import Navbar from "../components/navbar";

const FamHome = ({navigation}:any) => {
    const [formData, setformdata] = useState({
        name: '',
        email: '',
        phone: '',
        sobriety: -1,
        age: 0
    })

    useEffect(() => {
        const addictdata = async() => {
            try {
                const response = await apiClient.post(`/users/addictdata`)
                setformdata(response.data)
                console.log(response.data)
            } catch(err) {
                console.log(err)
            }
        }
        addictdata()
    }, [])

    return (
        <View>
            <Text>Home page</Text>
            <Logoutcomp navigation={navigation}/>
            <Text>{formData.name}</Text>
            <Text>{formData.sobriety}</Text>
            <Text>{formData.age}</Text>
            <Requesttest />
            <Navbar navigation={navigation}/>
        </View>
    )
}

export default FamHome