import { useState, useEffect } from "react";
import {View, Text} from "react-native";
import { Audio } from 'expo-av';

const VoiceRecorder = async (recordingURI:string|null, setRecordingURI:any, recordingOptions:any)=>{
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);

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

  return {startRecording, stopRecording};
}

const ShowVoicePage = async ()=>{
  const [recordingURI, setRecordingURI] = useState<string|null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);


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
 
const {startRecording, stopRecording} = await VoiceRecorder(recordingURI, setRecordingURI, recordingOptions);
useEffect(()=>{
  if(isRecording){
    startRecording();
  }
  else{
    stopRecording();
  }
}, [isRecording]);

useEffect(()=>{
  const uploadRecording = async(audioURL:string)=>{
    const formData = new FormData();
    const audioFile = {
      uri: recordingURI,
      name: 'voice_recording.m4a',
    };
    formData.append('voice_recording', audioFile as any);
  }
})
}

export default VoiceRecorder;