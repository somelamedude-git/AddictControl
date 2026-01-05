import { TouchableOpacity, Text } from "react-native";
import apiClient from "../utils/intercept";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ip } from "../creds";

const Logoutcomp = () => {

    const handlelogout = async() => {
        try {
            const response = await apiClient.post(`http://${ip}:5000/logout`)
            console.log(response.data)
            await AsyncStorage.multiRemove(['refreshToken', 'accessToken'])
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <TouchableOpacity
        onPress={handlelogout}
        >
            <Text>Logout</Text>
        </TouchableOpacity>
    )
}

export default Logoutcomp