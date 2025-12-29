import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";
import styles from "../../styles/profile.styles";
import COLORS from "@/constants/color";
import { useEffect, useState } from "react";
import { API_URL } from "@/constants/api";

type TestResult = {
  createdAt: string;
  logical_reasoning_score: number;
  attention_score?: number;
  memory_score?: number;
  overall_score?: number;
  voice_score?: number;
  attempted?: boolean;
};

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // Fetch test results
  useEffect(() => {
    if (!user) return;

    const fetchResults = async () => {
      try {
        setLoadingResults(true);
        const { token } = useAuthStore.getState();
        if (!token) {
          console.log("No token found");
          return;
        }

        const response = await fetch(`${API_URL}/test/see_results`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.log("HTTP error:", response.status);
          return;
        }

        const data = await response.json();
        console.log("API response:", data);

        if (data.success) setTestResults(data.test_results);
        else console.log("Backend error:", data.message);
      } catch (err) {
        console.log("Error fetching test results:", err);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, [user]);

  // Calculate dynamic stats
  const calculateStats = () => {
    if (!testResults.length) {
      return {
        today: 0,
        weeklyAvg: 0,
        streak: 0,
        weeklyCount: 0,
        overallScore: 0,
        sobrietyLevel: "N/A",
        totalLogical: 0,
      };
    }

    const todayScore = testResults[0].logical_reasoning_score || 0;

    const totalLogical = testResults.reduce(
      (sum, t) => sum + (t.logical_reasoning_score || 0),
      0
    );

    const overallScore = testResults.reduce(
      (sum, t) => sum + (t.overall_score || 0),
      0
    );

    // Weekly tests in last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyTests = testResults.filter(
      (t) => new Date(t.createdAt) >= oneWeekAgo
    );

    const weeklyAvg =
      Math.round(
        weeklyTests.reduce(
          (sum, t) => sum + (t.logical_reasoning_score || 0),
          0
        ) / (weeklyTests.length || 1)
      ) || 0;

    // Streak: consecutive logical reasoning >=50
    let streak = 0;
    for (let test of testResults) {
      if (test.logical_reasoning_score && test.logical_reasoning_score >= 50)
        streak++;
      else break;
    }

    // Sobriety level based on average overall score
    const avgOverall = overallScore / testResults.length;
    let sobrietyLevel = "Low";
    if (avgOverall >= 80) sobrietyLevel = "High";
    else if (avgOverall >= 50) sobrietyLevel = "Medium";

    return {
      today: todayScore,
      weeklyAvg,
      streak,
      weeklyCount: weeklyTests.length,
      overallScore,
      sobrietyLevel,
      totalLogical,
    };
  };

  const {
    today,
    weeklyAvg,
    streak,
    weeklyCount,
    overallScore,
    sobrietyLevel,
    totalLogical,
  } = calculateStats();

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(300)}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={["#52d4f5", "#1daec2ff"]} style={styles.header}>
          <Image
            source={require("../../assets/images/3.png")}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name || "Welcome"}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </LinearGradient>

        {/* Basic Info Card */}
        <LinearGradient colors={["#52d4f5", "#1daec2ff"]} style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="call-outline" size={20} color={COLORS.white} />
            <Text style={styles.cardText}>{user.phone}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="person-outline" size={20} color={COLORS.white} />
            <Text style={styles.cardText}>Role: {user.role}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.white} />
            <Text style={styles.cardText}>
              Joined: {new Date(user.createdAt).toDateString()}
            </Text>
          </View>
        </LinearGradient>

        {/* Dynamic Score */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Score</Text>
        </View>
        <LinearGradient colors={["#52d4f5", "#1daec2ff"]} style={styles.scoreCard}>
          <Text style={styles.moodText}>Today: {today}%</Text>
          <Text style={styles.moodText}>Weekly Avg: {weeklyAvg}%</Text>
          <Text style={styles.moodText}>Weekly Test Count: {weeklyCount}</Text>
          <Text style={styles.moodText}>Overall Logical: {totalLogical}</Text>
          <Text style={styles.moodText}>Overall Score: {overallScore}</Text>
          <Text style={styles.moodText}>Sobriety Level: {sobrietyLevel}</Text>
          <Text style={styles.moodText}>Streak: {streak} days</Text>
        </LinearGradient>

        {/* Latest Test Results */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Test Results</Text>
        </View>
        {loadingResults ? (
          <Text style={{ textAlign: "center", marginVertical: 10 }}>Loading...</Text>
        ) : testResults.length === 0 ? (
          <Text style={{ textAlign: "center", marginVertical: 10 }}>
            No test results yet.
          </Text>
        ) : (
          testResults.map((test, index) => (
            <LinearGradient
              key={index}
              colors={["#52d4f5", "#1daec2ff"]}
              style={styles.scoreCard}
            >
              <Text style={styles.moodText}>
                Date: {new Date(test.createdAt).toDateString()}
              </Text>
              <Text style={styles.moodText}>
                Logical Reasoning: {test.logical_reasoning_score}
              </Text>
              {test.attention_score !== undefined && (
                <Text style={styles.moodText}>
                  Attention: {test.attention_score}
                </Text>
              )}
              {test.memory_score !== undefined && (
                <Text style={styles.moodText}>Memory: {test.memory_score}</Text>
              )}
              {test.overall_score !== undefined && (
                <Text style={styles.moodText}>Overall Score: {test.overall_score}</Text>
              )}
              {test.voice_score !== undefined && (
                <Text style={styles.moodText}>Voice Score: {test.voice_score}</Text>
              )}
            </LinearGradient>
          ))
        )}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}
