import { View, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useRef, useState, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import QuestionCard from '@/components/questioncard';
import AudioQuestionCard from '@/components/Audioquestionncard';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/styles/profile.styles';
import COLORS from "../../constants/color"

const { width } = Dimensions.get('window');
const TOTAL_TEXT_QUESTIONS = 5;

const QUESTIONS = [
  { id: '1', question: 'What?' },
  { id: '2', question: '?' },
  { id: '3', question: '?' },
  { id: '4', question: '?.' },
  { id: '5', question: 'What?' },
];

export default function TestScreen() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const slideAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(0);
      setAnswer('');
      setAnswers({});
    }, [])
  );

  const handleSubmitAnswer = () => {
    const currentQuestion = QUESTIONS[currentIndex];

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));

    setAnswer('');

    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(0);
      setCurrentIndex(prev => prev + 1);
    });
  };

  if (!started) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}
      >
        <TouchableOpacity
          onPress={() => setStarted(true)}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
  colors={['#52d4f5', '#1daec2ff']}
  style={{
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  }}
>
  <Text style={{ color: COLORS.white, fontSize: 30, fontFamily:"JenWagner" }}>Start</Text>
</LinearGradient>

        </TouchableOpacity>
      </View>
    );
  }

  if (currentIndex >= TOTAL_TEXT_QUESTIONS) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 20,
          backgroundColor: '#f0f8ff',
        }}
      >
        <AudioQuestionCard
          onSubmit={audioUri => {
            console.log('Audio submitted:', audioUri);
            console.log('Text answers:', answers);

            setCurrentIndex(0);
            setAnswer('');
            setAnswers({});
            setStarted(false);
            router.replace('/home');
          }}
        />
      </View>
    );
  }

  const currentQuestion = QUESTIONS[currentIndex];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f8ff',
      }}
    >
      {/* Progress Bar */}
      <View
  style={{
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 40,
  }}
>
  <Animated.View
    style={{
      height: '100%',
      width: `${((currentIndex + 1) / TOTAL_TEXT_QUESTIONS) * 100}%`,
    }}
  >
    <LinearGradient
      colors={['#52d4f5', '#1daec2ff']}
      start={[0, 0]}
      end={[1, 1]}
      style={{
        flex: 1,
      }}
    />
  </Animated.View>
</View>


      <QuestionCard
        question={currentQuestion.question}
        questionNumber={currentIndex + 1}
        totalQuestions={QUESTIONS.length}
        answer={answer}
        onChangeAnswer={setAnswer}
        onSubmit={handleSubmitAnswer}
        slideAnim={slideAnim}
      />
    </View>
  );
}
