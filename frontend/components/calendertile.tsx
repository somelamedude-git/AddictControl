import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const formatDate = (date: Date) =>
  date.toISOString().split('T')[0];

const isSameDay = (d1: Date, d2: Date) =>
  d1.toDateString() === d2.toDateString();



const getCurrentWeek = () => {
  const today = new Date();
  const day = today.getDay(); 
  const mondayOffset = day === 0 ? -6 : 1 - day;

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return d;
  });
};

const getMonthDates = (year: number, month: number) => {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: lastDay }, (_, i) =>
    new Date(year, month, i + 1)
  );
};



export default function CalendarTile({
  drunkDays = [], //connect here
}: {
  drunkDays?: string[];
}) {
  const [expanded, setExpanded] = useState(false);

  const today = new Date();
  const weekDates = getCurrentWeek();
  const monthDates = getMonthDates(
    today.getFullYear(),
    today.getMonth()
  );

  return (
    <LinearGradient
    
     colors={['#00c9c8', '#00bcd4']}
        style={styles.container}>

   
    <View>
     
      <View style={styles.header}>
        <Text style={styles.title}> card</Text>
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.seeAll}>
            {expanded ? 'Hide' : 'See all'}
          </Text>
        </TouchableOpacity>
      </View>

    
      {!expanded && (
        <View style={styles.week}>
          {weekDates.map((date, i) => {
            const isToday = isSameDay(date, today);

            return (
              <View
                key={i}
                style={[
                  styles.dayBox,
                  isToday && styles.todayBox,
                ]}
              >
                <Text style={styles.dayNumber}>
                  {date.getDate()}
                </Text>
                <Text style={styles.dayText}>
                  {date.toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </Text>
              </View>
            );
          })}
        </View>
        
      )}

    
      {expanded && (
        <View style={styles.monthGrid}>
          {monthDates.map((date, i) => {
            const dateStr = formatDate(date);
            const isToday = isSameDay(date, today);
            const isDrunk = drunkDays.includes(dateStr);

            return (
              <View
                key={i}
                style={[
                  styles.dateCell,
                  isDrunk && styles.drunkDay,
                  isToday && styles.todayCell,
                ]}
              >
                <Text style={styles.dateText}>
                  {date.getDate()}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
     </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ebf2f6ff',
  },

  seeAll: {
    color: '#f6f9faff',
    fontSize: 13,
  },

 
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dayBox: {
    width: 48,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  todayBox: {
    backgroundColor: '#ffffffff',
    elevation: 2,
  },

  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color:' #666',
  },

  dayText: {
    fontSize: 11,
    color: '#666',
  },

 
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dateCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 6,
  },

  todayCell: {
    backgroundColor: '#ffffff',
  },

  drunkDay: {
    backgroundColor: '#ff4d4d',
  },

  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
