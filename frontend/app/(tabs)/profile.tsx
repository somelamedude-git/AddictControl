import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from '../../styles/profile.styles';
import CollapsibleTile from '../../components/Colapsibletile';
import CalendarTile from '@/components/calendertile';

export default function profile() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profile}>
          <View>
            <Text style={styles.hi}>Hi, WelcomeBack</Text>
            <Text style={styles.name}>User</Text> {/*hardcoded*/}
          </View>
          <Image
            source={require('../../assets/images/santulan.png')}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Categories to show them that the red means you were drunk and white locates the today hting and transparent means he was fine or test was not conducted */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text> 
      </View>

     
      <CalendarTile></CalendarTile>

       {/* Upcoming better claender */}
      {/*<LinearGradient
        colors={['#00c9c8', '#00bcd4']}
        style={styles.scheduleCard}
      >
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Test Results</Text>
        </View>

        <View style={styles.days}>
          {[
            ['9', 'MON'],
            ['10', 'TUE'],
            ['11', 'WED'],
            ['12', 'THU'],
            ['13', 'FRI'],
            ['12', 'SAT'],
          ].map((d, i) => (
            <View
              key={i}
              style={[
                styles.day,
                i === 2 && styles.activeDay,
              ]}
            >
              <Text style={[styles.dayNumber, i === 2 && styles.activeText]}>
                {d[0]}
              </Text>
              <Text style={[styles.dayText, i === 2 && styles.activeText]}>
                {d[1]}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.scheduleFooter}>
          <Text style={styles.scheduleInfo}>
            ● 11 Month - Wednesday - Today
          </Text>
          <Text style={styles.seeAllWhite}>See all</Text>
          
        </View>
      </LinearGradient> */}

      {/* Your Score */}
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Score</Text>
      </View>
      <LinearGradient
        colors={['#00c9c8', '#00bcd4']}
        style={styles.scoreCard}
      >
        <Text style={styles.moodText} >Today: 82%</Text>
        <Text  style={styles.moodText}>Weekly Avg: 76%</Text>
        <Text style={styles.moodText}>Streak: 5 days</Text>
      </LinearGradient>

      <LinearGradient
        colors={['#00c9c8', '#00bcd4']}
        style={styles.moodCard}
      >
        <Text style={styles.moodText}>incoming infographic element after backend is configured</Text>
      </LinearGradient>
    </ScrollView>
  );
}

