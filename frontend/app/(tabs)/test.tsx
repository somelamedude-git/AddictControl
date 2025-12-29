import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import QuestionCard from '@/components/questioncard';
import AudioQuestionCard from '@/components/Audioquestionncard';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from "../../constants/color";
import { useAuthStore } from "../../store/authStore";
import * as TestAPI from "../../lib/test.api";
import { API_URL } from '@/constants/api';

const { width } = Dimensions.get('window');

type Question = {
  id: string; // from backend
  text: string;
  type: string;
  expected_words?: string[];
  expected_sequence?: string[];
  expected_answer?: string;
};


export default function TestScreen() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [starting, setStarting] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const TOTAL_TEXT_QUESTIONS = questions.length;
  const hasFetchedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(0);
      setAnswer('');
      setAnswers({});
    }, [])
  );

  const startTest = async () => {
  if (starting) return; // prevent double-click
  try {
    setStarting(true);
    const { user } = useAuthStore.getState();
    if (!user) return;

    await TestAPI.requestTest(user.id);
    setStarted(true);

  } catch (err: any) {
    if (err.response?.status === 429) {
      alert("Too many requests! Please wait a few seconds and try again.");
    } else {
      console.log("Start test error:", err);
    }
  } finally {
    setStarting(false);
  }
};

useEffect(() => {
  if (!started || hasFetchedRef.current) return;

  hasFetchedRef.current = true; // lock fetching once per test session

  const fetchQuestions = async () => {
    try {
      const res = await TestAPI.fetchQuestions();
      setQuestions(res.test.questions);
    } catch (err: any) {
      console.log("Fetch questions error:", err);

      // Use fallback constant questions if API fails
      const fallbackQuestions: Question[] = [
        { id: '1', text: 'What is 2 + 2?', type: 'text' },
        { id: '2', text: 'Name the capital of France.', type: 'text' },
        { id: '3', text: 'What color do you get when you mix red and blue?', type: 'text' },
        { id: '4', text: 'Write a word that starts with "A".', type: 'text' },
        { id: '5', text: 'Spell the word "banana".', type: 'text' },
      ];

      setQuestions(fallbackQuestions);
    }
  };

  fetchQuestions();
}, [started]);

  const handleSubmitAnswer = async () => {
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return;

  try {
    // Check if the question is a fallback (no backend scoring)
    const isFallback = currentQuestion.id.length <= 2; // assuming fallback ids are '1', '2', etc.

    if (!isFallback) {
      // Normal backend submission
      await TestAPI.submitAnswer({
        question: currentQuestion,
        answer,
      });
    } else {
      // Fallback scoring (optional)
      console.log(`Fallback question answered: ${answer}`);
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));

    setAnswer('');

    // Animate slide
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(0);
      setCurrentIndex(prev => prev + 1);
    });
  } catch (err) {
    console.log("Submit answer error:", err);
  }
};
const handleAudioSubmit = async (audioUri: string) => {
  try {
    const { user, token } = useAuthStore.getState(); // get logged-in user and token
    if (!user || !token) {
      alert("User not logged in");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('audio_file', {
      uri: audioUri,            // Expo Audio URI
      type: 'audio/wav',        // MIME type
      name: 'voice_test.wav',   // filename
    } as any);                  // TypeScript fix

    // Send request
    const response = await fetch(`${API_URL}/voice-test`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Voice test score:", data.voice_score);
      alert(`Voice test completed! Score: ${data.voice_score}`);
    } else {
      console.log("Voice test failed:", data);
      alert(`Voice test failed: ${data.message || JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error("Audio submission error:", err);
    alert("Error submitting audio. Please try again.");
  }
};

  if (!started) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <TouchableOpacity onPress={startTest} style={{
          width: 120, height: 120, borderRadius: 60,
          justifyContent: 'center', alignItems: 'center',
          shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3, shadowRadius: 8, elevation: 10, overflow: 'hidden'
        }}>
          <LinearGradient colors={['#52d4f5', '#1daec2ff']} style={{
            width: 120, height: 120, borderRadius: 60,
            justifyContent: "center", alignItems: "center"
          }}>
            <Text style={{ color: COLORS.white, fontSize: 30, fontFamily: "JenWagner" }}>Start</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  if (started && questions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <Text style={{ color: COLORS.black }}>Loading questions...</Text>
      </View>
    );
  }

  if (currentIndex >= TOTAL_TEXT_QUESTIONS) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f0f8ff' }}>
        <AudioQuestionCard
  onSubmit={async (audioUri: string) => {
    // 1️⃣ Handle sending the audio to backend
    await handleAudioSubmit(audioUri);

    // 2️⃣ Reset local state and navigate
    console.log('Audio submitted:', audioUri);
    console.log('Text answers:', answers);

    hasFetchedRef.current = false;
    setQuestions([]);
    setStarted(false);
    setCurrentIndex(0);
    setAnswer('');
    setAnswers({});
    router.replace('/home');
  }}
/>

      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f0f8ff' }}>
      {/* Progress Bar */}
      <View style={{ height: 8, backgroundColor: '#ddd', borderRadius: 4, overflow: 'hidden', marginBottom: 40 }}>
        <Animated.View style={{
          height: '100%',
          width: TOTAL_TEXT_QUESTIONS ? `${((currentIndex + 1) / TOTAL_TEXT_QUESTIONS) * 100}%` : '0%'
        }}>
          <LinearGradient colors={['#52d4f5', '#1daec2ff']} start={[0, 0]} end={[1, 1]} style={{ flex: 1 }} />
        </Animated.View>
      </View>

      {/* Question Card */}
      <QuestionCard
        question={currentQuestion.text}
        questionNumber={currentIndex + 1}
        totalQuestions={TOTAL_TEXT_QUESTIONS}
        answer={answer}
        onChangeAnswer={setAnswer}
        onSubmit={handleSubmitAnswer}
        slideAnim={slideAnim}
      />
    </View>
  );
}
