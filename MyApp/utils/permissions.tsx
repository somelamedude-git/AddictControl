import { PermissionsAndroid, Platform, Button, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const requestAudioPermission = async()=>{
    try{
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: "Audio Permission",
                message: "This app needs access to your microphone to record audio.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            },

        );
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
            console.log("You can use the microphone");
        }        else{
            console.log("Microphone permission denied");
        }  
    }
    catch(err){
        console.warn(err);
    }
}

const checkAudioPermission = async()=>{
    if(Platform.OS === 'android'){
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        if(!hasPermission){
            await requestAudioPermission();
        }
    }
}

export {checkAudioPermission, requestAudioPermission};