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
import CalendarTile from "@/components/calendertile";
import styles from "../../styles/profile.styles";
import COLORS from "@/constants/color";

export default function Profile() {
  const { user, logout } = useAuthStore();

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
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
       
        <LinearGradient
          colors={['#52d4f5', '#1daec2ff']}
          style={styles.header}
        >
          <Image
            source={require("../../assets/images/3.png")}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            {user.name || "Welcome"}
          </Text>

          <Text style={styles.email}>
            {user.email}
          </Text>
        </LinearGradient>

      <LinearGradient
      colors={['#52d4f5', '#1daec2ff']}
      style={styles.card}>

    
        
          <View style={styles.cardRow}>
            <Ionicons name="call-outline" size={20} color={COLORS.white} />
            <Text style={styles.cardText}>{user.phone}</Text>
          </View>

          <View style={styles.cardRow}>
            <Ionicons name="person-outline" size={20} color={COLORS.white} />
            <Text style={styles.cardText}>
              Role: {user.role}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.white} />
            <Text style={styles.cardText}>
              Joined: {new Date(user.createdAt).toDateString()}
            </Text>
          </View>
        
          </LinearGradient>
{/*}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <CalendarTile />*/}

        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Score</Text>
        </View>

        <LinearGradient
          colors={['#52d4f5', '#1daec2ff']}
          style={styles.scoreCard}
        >
          <Text style={styles.moodText}>Today: 82%</Text>
          <Text style={styles.moodText}>Weekly Avg: 76%</Text>
          <Text style={styles.moodText}>Streak: 5 days</Text>
        </LinearGradient>

        {/* ===== Logout ===== */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

