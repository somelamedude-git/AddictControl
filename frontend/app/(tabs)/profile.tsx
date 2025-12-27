import {
  View,
  Text,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

import styles from "../../styles/profile.styles";
import CalendarTile from "@/components/calendertile";

export default function Profile() {
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profile}>
            <View>
              <Text style={styles.hi}>Hi, Welcome Back</Text>
              <Text style={styles.name}>User</Text>
            </View>

            <Image
              source={require("../../assets/images/santulan.png")}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <CalendarTile />

        {/* Your Score */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Score</Text>
        </View>

        <LinearGradient
          colors={["#00c9c8", "#00bcd4"]}
          style={styles.scoreCard}
        >
          <Text style={styles.moodText}>Today: 82%</Text>
          <Text style={styles.moodText}>Weekly Avg: 76%</Text>
          <Text style={styles.moodText}>Streak: 5 days</Text>
        </LinearGradient>

        <LinearGradient
          colors={["#00c9c8", "#00bcd4"]}
          style={styles.moodCard}
        >
          <Text style={styles.moodText}>
            Incoming infographic after backend is configured
          </Text>
        </LinearGradient>
      </ScrollView>
    </Animated.View>
  );
}
