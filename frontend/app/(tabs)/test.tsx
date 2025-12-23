import { View, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useRef, useState, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import QuestionCard from '@/components/questioncard';
import AudioQuestionCard from '@/components/Audioquestionncard';
import styles from '@/styles/auth.styles';

const { width } = Dimensions.get('window');
const TOTAL_TEXT_QUESTIONS = 5;

//hardecoded questions for testing
const QUESTIONS = [
  { id: '1', question: 'What ?' },
  { id: '2', question: 'What ?' },
  { id: '3', question: 'What ?' },
  { id: '4', question: 'What ?' },
  { id: '5', question: 'What ?' },
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,}}>
        <View style={styles.topCurve} />
      <View style={styles.buttomCurve} />
        <TouchableOpacity
          onPress={() => setStarted(true)}
          style={{ padding: 20, backgroundColor: '#52d4f5ff', borderRadius: 10 }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Start Test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  
  if (currentIndex >= TOTAL_TEXT_QUESTIONS) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 ,}}>
      <View style={styles.topCurve} />
      <View style={styles.buttomCurve} />
        <AudioQuestionCard
          onSubmit={(audioUri) => {
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
     
    <View style={{ flex: 1, justifyContent: 'center', padding: 30, }}>
      <View style={styles.topCurve} />
      <View style={styles.rightCurve} />
      <View style={styles.leftCurve} />
      <View style={styles.buttomCurve} />
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
