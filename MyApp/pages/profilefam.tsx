import axios from "axios"
import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { useAuthStore } from "../utils/state_utils/zust"
import Navbar from "../components/navbar"

const ProfileF = ({navigation}:any) => {
    const [data, setdata] = useState({
        phone: '',
        email: '',
        name: '',
    })
    const [addict_member, setaddict_member] = useState('')

    const accessToken = useAuthStore((state: any) => state.accessToken);

    useEffect(()=>{
        const getdata = async()=>{
            try {
                const response = await axios.get("http://localhost:5000/profile_b", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })

                setdata(response.data.basic_info)
                setaddict_member(response.data.addict_member)
                console.log(response.data)
            } catch(err:any) {
                console.log(err.message)
            }
        }

        getdata()
    },[])
    return (
        <View>
            <Text>{data.phone}</Text>
            <Text>{data.email}</Text>
            <Text>{data.name}</Text>
            <Text>{addict_member}</Text>
            <Navbar navigation={navigation}/>
        </View>
    )
}

export default ProfileF