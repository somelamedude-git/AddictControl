
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import COLORS from '../constants/color';
import { LinearGradient } from 'expo-linear-gradient';

type QuestionCardProps = {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  answer: string;
  onChangeAnswer: (text: string) => void;
  onSubmit: () => void;
  slideAnim: Animated.Value;
};

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onChangeAnswer,
  onSubmit,
  slideAnim,
}: QuestionCardProps) {
  const isDisabled = !answer.trim();

  return (
    <Animated.View
      style={{
        transform: [{ translateX: slideAnim }],
        backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginTop: -24,
      }}
    >
      {/* Question Number */}
      <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.textPrimary }}>
        Question {questionNumber} of {totalQuestions}
      </Text>

      {/* Question Text */}
      <Text style={{ marginTop: 12, fontSize: 16, color: COLORS.textDark }}>{question}</Text>

      {/* Answer Input */}
      <TextInput
        value={answer}
        onChangeText={onChangeAnswer}
        placeholder="Type your answer"
        placeholderTextColor={COLORS.placeholderText}
        style={{
          flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
        }}
      />
      

      {/* Submit Button */}
      <TouchableOpacity
        onPress={onSubmit}
        disabled={isDisabled}
        style={{
    borderRadius: 12,
    overflow: 'hidden', // required for gradient rounded corners
    marginTop: 20,
  }}
      >
        <LinearGradient
    colors={isDisabled ? ['#b3e5fc', '#a3dcf7ff'] : ['#52d4f5', '#1daec2ff']}
    start={[0, 0]}
    end={[1, 1]}
    style={{ padding: 15, justifyContent: 'center', alignItems: 'center' }}
  >
    <Text
      style={{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
      }}
    >
      Submit Answer
    </Text>
  </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}
