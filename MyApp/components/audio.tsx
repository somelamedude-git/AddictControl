import { useState, useEffect } from "react";
import {View, Text} from "react-native";
import { Audio } from 'expo-av';

export const VoiceRecorder = ()=>{
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingURI, setRecordingURI] = useState<string | null>(null);


const recordingOptions: Audio.RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: 2,      
    audioEncoder: 3,      
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },

  ios: {
    extension: '.caf',
    audioQuality: 1,     
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },

  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};


    const startRecording = async()=>{
        try{
            const permission = await Audio.requestPermissionsAsync();
            if(permission.status !== 'granted'){
                console.log("Permission to access microphone denied");
                return;
            }
            
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                interruptionModeAndroid: 1,
                shouldDuckAndroid: true
            });

            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(recordingOptions);
            await newRecording.startAsync();
            setIsRecording(true);
            setRecording(newRecording);
            setRecordingURI(null);
            console.log("Recording started");

        }
        catch(err){
            console.warn("Failed to start recording:", err);
        }
    }

     const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped. File saved at:', uri);

      setRecordingURI(uri);
      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

}

export default VoiceRecorder;
