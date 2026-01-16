import {useEffect, useState} from "react";
import {View, Text, Button, TextInput} from "react-native";
import axios from "axios";
import {checkAudioPermission} from "../utils/permissions";
import NavbarAdd from "../components/navbaraddict";
import { useAuthStore } from "../utils/state_utils/zust";
import {ShowVoicePage} from "../components/audio";

export const TestPortal = ({navigation}: any)=>{
    const [testActive, setTestActive] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Array<any>>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [voiceTestValid, setVoiceTestValid] = useState<boolean>(false);
    const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean>(false);
    const [cognitionScore, setCognitionScore] = useState<number>(0);
    const [audioScore, setAudioScore] = useState<number>(0);
    const [currentAnswer, setCurrentAnswer] = useState<string>("");

    const boiler_plate_string = "Hello there, the person who has written this quote is super awesome and can beat bruce lee in a fight";

    useEffect(()=>{
        const checkPermission = async()=>{
            await checkAudioPermission();
            setAudioPermissionGranted(true);
        }
        checkPermission();
    }, []);

    const nextQuestion = ()=>{
        if(currentQuestionIndex === questions.length-1){

            setVoiceTestValid(true);
            return;
        }
        if(currentQuestionIndex < questions.length - 1){
            setCurrentQuestionIndex(prev=>prev+1);
        }
    }
    const prevQuestion = ()=>{
        if(currentQuestionIndex > 0){
            setCurrentQuestionIndex(prev=>prev-1);
        }
    }

    const submitAnswer = async()=>{
        const answer = currentAnswer;
        const response = await axios.post('http://localhost:5000/test/submit_answer', {
            question: questions[currentQuestionIndex],
            answer: answer
        });

        if(response.data.success){
            setCognitionScore(prev=>prev+response.data.sum);
            nextQuestion();
        }
    }

    const onPress = async () => {
  try {
    const accessToken = useAuthStore((state: any) => state.accessToken);

    if (!accessToken) {
      console.log('access token not found');
      return;
    }

    const resp = await axios.post(
      'http://localhost:5000/test/questions',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

        if(!response.data.success){
            console.log("Could not fetch questions");
            return;
        }
        setTestActive(true);
        setQuestions(response.data.test);
    }

    return (
       <View>
  {!testActive ? (
    <Button title="Start Test" onPress={onPress} />
  ) : (
    <View>
      {questions[currentQuestionIndex] && (
        <>
        <Text>{questions[currentQuestionIndex].question_text}</Text>
        <Button title="Record Answer" onPress={submitAnswer}/> 
        </>  
      )}

      {voiceTestValid && audioPermissionGranted && (
  <ShowVoicePage
  />
)}

      <Button title="Previous" onPress={prevQuestion} />
      <Button title="Next" onPress={nextQuestion} />
    </View>
  )}
  <NavbarAdd navigation={navigation} />
</View>
    );
}