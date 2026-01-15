import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "./state_utils/zust";

const fetchAccessToken = async()=>{
    try{
        const token = await AsyncStorage.getItem('accessToken');
        if(token) useAuthStore.setState({accessToken: token});
        return token;
    }
    catch(err){
        console.warn("Error fetching access token:", err);
        return null;
    }
}

export {fetchAccessToken};