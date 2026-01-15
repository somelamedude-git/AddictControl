import { View, Text } from "react-native";
import Requesttest from "../components/requesttest";
import Logoutcomp from "../components/logout";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import { useAuthStore } from "../utils/state_utils/zust";

const FamHome = ({navigation}:any) => {
    const [formData, setformdata] = useState({
        name: '',
        email: '',
        phone: '',
        sobriety: -1,
        age: 0
    });

const accessToken = useAuthStore((state: any) => state.accessToken);

    useEffect(() => {
        const addictdata = async() => {
            try {
               const response = await axios.post(
  'http://localhost:5000/users/addictdata',  
  {},                  
  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
);
                setformdata(response.data);
                console.log(response.data);
            } catch(err) {
                console.log(err);
            }
        }
        addictdata();
    }, [accessToken])

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

export default FamHome;