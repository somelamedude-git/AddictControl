import { View, Text } from "react-native"
import NavbarAdd from "../components/navbaraddict"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuthStore } from "../utils/state_utils/zust"

const ProfileA = ({navigation}:any)=>{
    const [data, setdata] = useState({
        name: '',
        email: '',
        phone: ''
    })
    const [sobriety, setsobriety] = useState(-1)

    const accessToken = useAuthStore((state: any) => state.accessToken);

    useEffect(()=>{
        const getdata = async() => {
            try {
                const response = await axios.get('http://localhost:5000/profile_a', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })

                setdata(response.data.basic_info)
                setsobriety(response.data.sobriety)
                console.log(response.data)
            } catch (err:any) {
                console.log(err.message)
            }
        }

        getdata()
    },[])
    return(
        <View>
            <Text>{data.phone}</Text>
            <Text>{data.email}</Text>
            <Text>{data.name}</Text>
            <Text>{sobriety}</Text>
            <NavbarAdd navigation={navigation}/>
        </View>
    )
}

export default ProfileA