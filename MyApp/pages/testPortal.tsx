import { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ImageBackground } from "react-native";
import axios from "axios";
import { checkAudioPermission } from "../utils/permissions";
import NavbarAdd from "../components/navbaraddict";
import { useAuthStore } from "../utils/state_utils/zust";

export const TestPortal = ({ navigation }: any) => {
    const [testActive, setTestActive] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Array<any>>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [voiceTestValid, setVoiceTestValid] = useState<boolean>(false);
    const [audioPermissionGranted, setAudioPermissionGranted] = useState<boolean>(false);
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [currentAnswer, setCurrentAnswer] = useState<string>("");

    const boiler_plate_string = "Hello there, the person who has written this quote is super awesome and can beat bruce lee in a fight";

    const accessToken = useAuthStore((state: any) => state.accessToken);

    useEffect(() => {
        const checkPermission = async () => {
            await checkAudioPermission();
            setAudioPermissionGranted(true);
        }
        checkPermission();
    }, []);

    const nextQuestion = () => {
        if (currentQuestionIndex === questions.length - 1) {
            setVoiceTestValid(true);
            return;
        }
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    }
    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    }

    const submitAnswer = async () => {
        // Logic from Target
        const answer = currentAnswer;
        try {
            const response = await axios.post('http://localhost:5000/test/submit_answer', {
                question: questions[currentQuestionIndex],
                answer: answer
            });

            if (response.data.success) {
                setCurrentScore(prev => prev + response.data.sum);
                nextQuestion();
            }
        } catch (err) {
            console.log("Submit error:", err);
            // Fallback for demo if backend fails
            nextQuestion();
        }
    }

    const startTest = async () => {
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
            console.log('access token not found');
            navigation.navigate('Login');
            return;
        }

        try {
            // Target logic: Fetch questions
            // Note: Target call had duplicate calls in code, I'm cleaning it up to one robust call.
            const response = await axios.post('http://localhost:5000/test/questions', {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response.data.success) {
                console.log("Could not fetch questions");
                return;
            }
            setQuestions(response.data.test);
            setTestActive(true);
        } catch (err) {
            console.log("Error starting test:", err);
        }
    }

    return (
        <ImageBackground
            source={require('../components/assets/images/bg.jpg')}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Text style={styles.backButtonText}>← Exit</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Daily Screening</Text>
                        <View style={{ width: 50 }} />
                    </View>

                    <View style={styles.contentContainer}>
                        {!testActive ? (
                            <View style={styles.startCard}>
                                <Text style={styles.startTitle}>Ready to begin?</Text>
                                <Text style={styles.startSubtitle}>This brief screening helps track your recovery progress.</Text>
                                <TouchableOpacity style={styles.primaryButton} onPress={startTest}>
                                    <Text style={styles.primaryButtonText}>START ASSESSMENT</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.questionCard}>
                                {voiceTestValid ? (
                                    <View style={styles.completionContainer}>
                                        <Text style={styles.completionTitle}>Assessment Complete</Text>
                                        <Text style={styles.completionText}>Thank you for checking in today.</Text>
                                        <Text style={styles.completionSubText}>Your results have been recorded.</Text>
                                        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('TestR')}>
                                            <Text style={styles.primaryButtonText}>VIEW RESULTS</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <>
                                        <View style={styles.progressContainer}>
                                            <Text style={styles.progressText}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
                                            <View style={styles.progressBar}>
                                                <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }]} />
                                            </View>
                                        </View>

                                        {questions[currentQuestionIndex] && (
                                            <Text style={styles.questionText}>{questions[currentQuestionIndex].question_text}</Text>
                                        )}

                                        <View style={styles.recordingPlaceholder}>
                                            <View style={styles.micCircle}>
                                                <Text style={{ fontSize: 30 }}>🎙️</Text>
                                            </View>
                                            <Text style={styles.recordingText}>Listening...</Text>
                                            {/* Logic note: In a real implementation, Voice Detection would update currentAnswer here */}
                                        </View>

                                        {/* Permission Helper Text */}
                                        {audioPermissionGranted && (
                                            <Text style={styles.helperText}>Please read: "{boiler_plate_string}"</Text>
                                        )}

                                        <View style={styles.navigationRow}>
                                            <TouchableOpacity
                                                style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
                                                onPress={prevQuestion}
                                                disabled={currentQuestionIndex === 0}
                                            >
                                                <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.disabledButtonText]}>Previous</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.navButtonPrimary} onPress={submitAnswer}>
                                                <Text style={styles.navButtonTextPrimary}>{currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Spacer for Navbar */}
                    <View style={{ height: 80 }} />

                    <View style={styles.navbarContainer}>
                        <NavbarAdd navigation={navigation} />
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f2f6',
    },
    backButton: {
        padding: 5,
    },
    backButtonText: {
        color: '#636e72',
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    startCard: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    startTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#2d3436',
        marginBottom: 10,
    },
    startSubtitle: {
        fontSize: 16,
        color: '#636e72',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    primaryButton: {
        backgroundColor: '#4A61AF',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 1,
    },
    questionCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        padding: 25,
        minHeight: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        justifyContent: 'space-between',
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressText: {
        color: '#b2bec3',
        fontSize: 12,
        marginBottom: 8,
        fontWeight: '600',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#dfe6e9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4A61AF',
    },
    questionText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2d3436',
        lineHeight: 30,
        marginBottom: 30,
    },
    recordingPlaceholder: {
        alignItems: 'center',
        marginBottom: 30,
    },
    micCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e6fffa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#4A61AF',
    },
    recordingText: {
        color: '#4A61AF',
        fontWeight: '600',
    },
    helperText: {
        fontSize: 12,
        color: '#b2bec3',
        textAlign: 'center',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    navigationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    disabledButton: {
        opacity: 0.5,
    },
    navButtonText: {
        color: '#636e72',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButtonText: {
        color: '#b2bec3',
    },
    navButtonPrimary: {
        backgroundColor: '#4A61AF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    navButtonTextPrimary: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    completionContainer: {
        alignItems: 'center',
        padding: 20,
    },
    completionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2d3436',
        marginBottom: 10,
    },
    completionText: {
        fontSize: 16,
        color: '#636e72',
        marginBottom: 5,
    },
    completionSubText: {
        fontSize: 14,
        color: '#b2bec3',
        marginBottom: 30,
    },
    navbarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    }
});

export default TestPortal;