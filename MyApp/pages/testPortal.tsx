import { useEffect, useState } from "react";
import { View, Text, Button, TextInput, ScrollView, Alert } from "react-native";
import NavbarAdd from "../components/navbaraddict";
import { useAuthStore } from "../utils/state_utils/zust";

// Question pools (moved to frontend)
const questionPools = {
  registration: [
    {
      text: "Please listen carefully. I am going to say three words. After I say them, please repeat them back to me immediately. The words are: APPLE, TABLE, PENNY.",
      expected_words: ["apple", "table", "penny"]
    },
    {
      text: "I'm going to name three common items. Please repeat them back to me right after I say them. The items are: CHAIR, FLOWER, CAR.",
      expected_words: ["chair", "flower", "car"]
    },
    {
      text: "Listen closely. I'll say three words once — repeat them immediately after me. Ready? LEMON, SOCK, CLOUD.",
      expected_words: ["lemon", "sock", "cloud"]
    },
    {
      text: "I will mention three unrelated words. Please say them back to me right away. They are: BRIDGE, SPOON, TIGER.",
      expected_words: ["bridge", "spoon", "tiger"]
    },
    {
      text: "Pay attention. I'm saying three words — repeat them as soon as I finish. Here they are: WINDOW, BOOK, RAIN.",
      expected_words: ["window", "book", "rain"]
    }
  ],

  attention: [
    {
      text: "Starting from 100, please subtract 7, and continue subtracting 7 each time. Keep going until you have given me five numbers.",
      expected_sequence: ["93", "86", "79", "72", "65"]
    },
    {
      text: "Begin at 90 and subtract 3 each time. Tell me the first five results out loud.",
      expected_sequence: ["87", "84", "81", "78", "75"]
    },
    {
      text: "Please count backwards from 100 by 7s. Give me the next five numbers after 100.",
      expected_sequence: ["93", "86", "79", "72", "65"]
    },
    {
      text: "Now spell the word 'HOUSE' backwards for me, letter by letter.",
      expected_answer: "esuoh"
    },
    {
      text: "Spell 'TABLE' backwards, please.",
      expected_answer: "elbat"
    },
    {
      text: "Starting from 80, subtract 5 each time. Tell me five numbers in the sequence.",
      expected_sequence: ["75", "70", "65", "60", "55"]
    }
  ],

  other_cognitive: [
    {
      text: "How many nickels are in two dollars and fifteen cents?",
      expected_answer: "43"
    },
    {
      text: "If a quarter is 25 cents, how many quarters make up three dollars?",
      expected_answer: "12"
    },
    {
      text: "How many dimes are there in one dollar and eighty cents?",
      expected_answer: "18"
    },
    {
      text: "Tell me how many pennies are in four dollars and twenty-five cents.",
      expected_answer: "425"
    }
  ],

  recall: [
    {
      text: "Earlier, I asked you to remember three words. What were those three words?",
      expected_words: [] // dynamically filled
    }
  ]
};

// Generate exactly 5 random questions
const generateQuestions = () => {
  const randomFrom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  // 1. Registration - always first
  const regQ = randomFrom(questionPools.registration);
  const registrationWords = regQ.expected_words;

  // 2. Always 3 middle questions (forced to make total 5)
  const middleQuestions: any[] = [];
  const numMiddle = 3; // Fixed to 3 → total 5 questions

  for (let i = 0; i < numMiddle; i++) {
    const pool = Math.random() > 0.5 ? questionPools.attention : questionPools.other_cognitive;
    middleQuestions.push(randomFrom(pool));
  }

  // 3. Recall - always last
  const recallQ = { ...questionPools.recall[0] };
  recallQ.expected_words = registrationWords;

  // Build array (guaranteed 5)
  let questions = [
    { id: 1, text: regQ.text, type: "registration", expected_words: registrationWords },
    ...middleQuestions.map((q: any, idx: number) => ({
      id: idx + 2,
      text: q.text,
      type: q.expected_sequence ? "attention" : "other_cognitive",
      ...(q.expected_sequence 
        ? { expected_sequence: q.expected_sequence } 
        : { expected_answer: q.expected_answer })
    })),
    { id: 5, text: recallQ.text, type: "recall", expected_words: recallQ.expected_words }
  ];

  // Shuffle middle 3 questions only (positions 1 to 3)
  for (let i = questions.length - 2; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  // Re-assign IDs after shuffle
  questions.forEach((q: any, idx: number) => {
    q.id = idx + 1;
  });

  return questions;
};

export const TestPortal = ({ navigation }: any) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [voiceTestValid, setVoiceTestValid] = useState<boolean>(false);
  const [cognitionScore, setCognitionScore] = useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  const accessToken = useAuthStore((state: any) => state.accessToken);

  useEffect(() => {
    try {
      const generated = generateQuestions();
      console.log("Generated questions (should be 5):", generated);
      setQuestions(generated);
      setLoading(false);
    } catch (err) {
      console.error("Question generation error:", err);
      setError("Failed to generate questions");
      setLoading(false);
    }
  }, []);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setVoiceTestValid(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      Alert.alert("Required", "Please enter your answer");
      return;
    }

    try {
      const question = questions[currentQuestionIndex];

      const response = await fetch("http://localhost:5000/test/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          question,
          answer: currentAnswer,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCognitionScore((prev) => prev + (data.sum || 0));
        setCurrentAnswer(""); // Clear input
        nextQuestion(); // Move to next (or complete)
      } else {
        Alert.alert("Error", data.message || "Failed to submit answer");
      }
    } catch (err) {
      console.error("Submit error:", err);
      Alert.alert("Error", "Could not submit answer");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Preparing questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      </View>
    );
  }

  // Safety: if index invalid (should never happen now)
  if (currentQuestionIndex >= questions.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Test completed unexpectedly</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <NavbarAdd navigation={navigation} />

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
          Cognitive Assessment
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 20 }}>
          Current Score: {cognitionScore}
        </Text>

        <View>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>

          <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 16 }}>
            {questions[currentQuestionIndex]?.text || "Question text missing"}
          </Text>

          <TextInput
            multiline
            numberOfLines={5}
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChangeText={setCurrentAnswer}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              minHeight: 100,
              marginBottom: 16,
              backgroundColor: "#fff",
            }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
            <Button
              title="Previous"
              onPress={prevQuestion}
              disabled={currentQuestionIndex === 0}
            />

            <Button
              title={
                currentQuestionIndex === questions.length - 1
                  ? "Submit Final Answer"
                  : "Submit & Next"
              }
              onPress={submitAnswer}
            />
          </View>
        </View>

        {voiceTestValid && (
          <View style={{ marginTop: 32, alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "green", marginBottom: 16 }}>
              Cognitive Test Completed!
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 16 }}>
              Final Score: {cognitionScore}
            </Text>
            <Button
              title="Proceed to Voice Test"
              onPress={() => navigation.navigate("VoiceTestScreen")}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};