import {useEffect, useState} from "react";
import {View, Text, Button} from "react-native";
import axios from "axios";
import {checkAudioPermission} from "../utils/permissions";

export const TestPortal = ({navigation}: any)=>{
    const [testActive, setTestActive] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Array<any>>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [voiceTestValid, setVoiceTestValid] = useState<boolean>(false);
    const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean>(false);

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

    const onPress = async()=>{
        const response = await axios.post('/get_questions');
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
        <Text>{questions[currentQuestionIndex].question_text}</Text>
      )}

      {voiceTestValid && audioPermissionGranted && (
        <Text>Voice Test Validated!</Text>
      )}
      <Button title="Previous" onPress={prevQuestion} />
      <Button title="Next" onPress={nextQuestion} />
    </View>
  )}
</View>
    );
}