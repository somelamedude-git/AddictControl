
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type QuestionCardProps = {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  answer: string;
  onChangeAnswer: (text: string) => void;
  onSubmit: () => void;
  slideAnim: Animated.Value;
};

export default function questioncard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onChangeAnswer,
  onSubmit,
  slideAnim,
}: QuestionCardProps) {
  return (
    <Animated.View
      style={{
        transform: [{ translateX: slideAnim }],
        backgroundColor: '#d1f4fdfb',
        borderRadius: 16,
        padding: 20,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600' }}>
        Question {questionNumber} of {totalQuestions}
      </Text>

      <Text style={{ marginTop: 12, fontSize: 16 }}>{question}</Text>

      <TextInput
        value={answer}
        onChangeText={onChangeAnswer}
        placeholder="Type your answer"
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginTop: 20,
          borderColor:'#00bcd4',
        }}
      />
      
      <TouchableOpacity
        onPress={onSubmit}
        disabled={!answer.trim()}
        style={{
          backgroundColor:'#00bcd4',
          padding: 15,
          marginTop: 20,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#f9f4f4ff', textAlign: 'center' }}>Submit Answer</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
