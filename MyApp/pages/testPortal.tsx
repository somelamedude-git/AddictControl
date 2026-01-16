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
import NavbarAdd from "../components/navbaraddict";
import { useAuthStore } from "../utils/state_utils/zust";
import { checkAudioPermission } from "../utils/permissions";

export const TestPortal = ({ navigation }: any) => {
  const [testActive, setTestActive] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Array<any>>([]);
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
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  /* ------------------ SUBMIT ANSWER ------------------ */
  const submitAnswer = async () => {
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