import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { View, Text, Button, TextInput, ScrollView, Alert } from "react-native";
import NavbarAdd from "../components/navbaraddict";
import { useAuthStore } from "../utils/state_utils/zust";
import { checkAudioPermission } from "../utils/permissions";

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

  const [audioPermissionGranted, setAudioPermissionGranted] =
    useState<boolean>(false);

  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [cognitionScore, setCognitionScore] = useState<number>(0);

  const accessToken = useAuthStore((state: any) => state.accessToken);

  const boiler_plate_string =
    "Hello there, the person who has written this quote is super awesome and can beat bruce lee in a fight";

  /* ------------------ PERMISSIONS ------------------ */
  useEffect(() => {
    const checkPermission = async () => {
      await checkAudioPermission();
      setAudioPermissionGranted(true);
    };
    checkPermission();
  }, []);

  /* ------------------ NAVIGATION ------------------ */
  const nextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setVoiceTestValid(true);
      return;
    }
    setCurrentQuestionIndex((prev) => prev + 1);

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

  /* ------------------ SUBMIT ANSWER ------------------ */
  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      Alert.alert("Required", "Please enter your answer");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/test/submit_answer",
        {
          question: questions[currentQuestionIndex],
          answer: currentAnswer,
        }
      );

      if (response.data.success) {
        setCognitionScore((prev) => prev + response.data.sum);
        nextQuestion();
      }
    } catch (err) {
      console.log("Submit error:", err);
      // fallback: allow progression even if backend fails
      nextQuestion();
    }
  };

  /* ------------------ START TEST ------------------ */
  const startTest = async () => {
    if (!accessToken) {
      console.log("access token not found");
      navigation.navigate("Login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/test/questions",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.data.success) {
        console.log("Could not fetch questions");
        return;
      }

      setQuestions(response.data.test);
      setTestActive(true);
    } catch (err) {
      console.log("Error starting test:", err);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <ImageBackground
      source={require("../components/assets/images/bg.jpg")}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Exit</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Daily Screening</Text>
            <View style={{ width: 50 }} />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {!testActive ? (
              <View style={styles.startCard}>
                <Text style={styles.startTitle}>Ready to begin?</Text>
                <Text style={styles.startSubtitle}>
                  This brief screening helps track your recovery progress.
                </Text>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={startTest}
                >
                  <Text style={styles.primaryButtonText}>
                    START ASSESSMENT
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.questionCard}>
                {voiceTestValid ? (
                  <View style={styles.completionContainer}>
                    <Text style={styles.completionTitle}>
                      Assessment Complete
                    </Text>
                    <Text style={styles.completionText}>
                      Thank you for checking in today.
                    </Text>
                    <Text style={styles.completionSubText}>
                      Your results have been recorded.
                    </Text>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => navigation.navigate("TestR")}
                    >
                      <Text style={styles.primaryButtonText}>
                        VIEW RESULTS
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    {/* Progress */}
                    <View style={styles.progressContainer}>
                      <Text style={styles.progressText}>
                        Question {currentQuestionIndex + 1} of{" "}
                        {questions.length}
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${
                                ((currentQuestionIndex + 1) /
                                  questions.length) *
                                100
                              }%`,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    {/* Question */}
                    {questions[currentQuestionIndex] && (
                      <Text style={styles.questionText}>
                        {questions[currentQuestionIndex].question_text}
                      </Text>
                    )}

                    {/* Voice Placeholder */}
                    <View style={styles.recordingPlaceholder}>
                      <View style={styles.micCircle}>
                        <Text style={{ fontSize: 30 }}>🎙️</Text>
                      </View>
                      <Text style={styles.recordingText}>Listening...</Text>
                    </View>

                    {audioPermissionGranted && (
                      <Text style={styles.helperText}>
                        Please read: "{boiler_plate_string}"
                      </Text>
                    )}

                    {/* Navigation */}
                    <View style={styles.navigationRow}>
                      <TouchableOpacity
                        style={[
                          styles.navButton,
                          currentQuestionIndex === 0 &&
                            styles.disabledButton,
                        ]}
                        onPress={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <Text
                          style={[
                            styles.navButtonText,
                            currentQuestionIndex === 0 &&
                              styles.disabledButtonText,
                          ]}
                        >
                          Previous
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.navButtonPrimary}
                        onPress={submitAnswer}
                      >
                        <Text style={styles.navButtonTextPrimary}>
                          {currentQuestionIndex === questions.length - 1
                            ? "Finish"
                            : "Next"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>

          <View style={{ height: 80 }} />
          <View style={styles.navbarContainer}>
            <NavbarAdd navigation={navigation} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default TestPortal;

/* ------------------ STYLES ------------------ */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
  },
  backButton: { padding: 5 },
  backButtonText: { color: "#636e72", fontSize: 16, fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#2d3436" },
  contentContainer: { flex: 1, padding: 20, justifyContent: "center" },

  startCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 5,
  },
  startTitle: { fontSize: 24, fontWeight: "800", marginBottom: 10 },
  startSubtitle: {
    fontSize: 16,
    color: "#636e72",
    textAlign: "center",
    marginBottom: 30,
  },

  primaryButton: {
    backgroundColor: "#4A61AF",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "700" },

  questionCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 25,
    minHeight: 400,
    justifyContent: "space-between",
  },

  progressContainer: { marginBottom: 20 },
  progressText: { fontSize: 12, marginBottom: 8 },
  progressBar: {
    height: 6,
    backgroundColor: "#dfe6e9",
    borderRadius: 3,
  },
  progressFill: { height: "100%", backgroundColor: "#4A61AF" },

  questionText: { fontSize: 22, fontWeight: "700", marginBottom: 30 },

  recordingPlaceholder: { alignItems: "center", marginBottom: 30 },
  micCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e6fffa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  recordingText: { color: "#4A61AF", fontWeight: "600" },

  helperText: { fontSize: 12, textAlign: "center", marginBottom: 20 },

  navigationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: { paddingVertical: 12, paddingHorizontal: 20 },
  navButtonPrimary: {
    backgroundColor: "#4A61AF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  navButtonText: { fontSize: 16 },
  navButtonTextPrimary: { color: "#fff", fontWeight: "700" },

  completionContainer: { alignItems: "center", padding: 20 },
  completionTitle: { fontSize: 22, fontWeight: "800", marginBottom: 10 },

  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
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
