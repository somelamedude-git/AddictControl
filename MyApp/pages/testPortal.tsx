import { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import NavbarAdd from "../components/navbaraddict";
import { useAuthStore } from "../utils/state_utils/zust";

export const TestPortal = ({ navigation }: any) => {
  const [testActive, setTestActive] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Array<any>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [voiceTestValid, setVoiceTestValid] = useState<boolean>(false);
  const [cognitionScore, setCognitionScore] = useState<number>(0);
//   const [audioScore, setAudioScore] = useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const accessToken = useAuthStore((state: any) => state.accessToken);

  const nextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setVoiceTestValid(true);
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitAnswer = async () => {
    try {
      const answer = currentAnswer;

      const response = await fetch("http://localhost:5000/test/submit_answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questions[currentQuestionIndex],
          answer: answer,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCognitionScore((prev) => prev + data.sum);
        nextQuestion();
      }
    } catch (err) {
      console.log("Error submitting answer:", err);
    }
  };

  const onPress = async () => {
    try {
      if (!accessToken) {
        console.log("access token not found");
        return;
      }

      const response = await fetch("http://localhost:5000/test/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!data.success) {
        console.log("Could not fetch questions");
        return;
      }

      setTestActive(true);
      setQuestions(data.test);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      {!testActive ? (
        <Button title="Start Test" onPress={onPress} />
      ) : (
        <View>
          {questions[currentQuestionIndex] && (
            <>
              <Text>{questions[currentQuestionIndex].question_text}</Text>

              <TextInput value={currentAnswer} onChangeText={setCurrentAnswer} />

              <Button title="Submit Answer" onPress={submitAnswer} />
            </>
          )}

          <Button title="Previous" onPress={prevQuestion} />
          <Button title="Next" onPress={nextQuestion} />
        </View>
      )}

      <NavbarAdd navigation={navigation} />
    </View>
  );
};

