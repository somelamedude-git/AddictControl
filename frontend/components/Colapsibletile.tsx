import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/profile.styles'; 

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

export default function CalendarTile({ drunkDays = [] }: { drunkDays?: string[] }) {
  const [expanded, setExpanded] = useState(false);

  const today = new Date();
  const weekDates = getCurrentWeek();
  const monthDates = getMonthDates(
    today.getFullYear(),
    today.getMonth()
  );

  return (
    <View>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Score</Text>
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.seeAll}>
            {expanded ? 'Hide' : 'See all'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* WEEK VIEW */}
      {!expanded && (
        <View style={styles.days}>
          {weekDates.map((date, i) => {
            const isToday = isSameDay(date, today);

            return (
              <View
                key={i}
                style={[
                  styles.day,
                  isToday && styles.activeDay,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isToday && styles.activeText,
                  ]}
                >
                  {date.getDate()}
                </Text>

                <Text
                  style={[
                    styles.dayText,
                    isToday && styles.activeText,
                  ]}
                >
                  {date.toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* MONTH VIEW */}
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
                  styles.monthDay,
                  isToday && styles.monthToday,
                  isDrunk && styles.monthDrunk,
                ]}
              >
                <Text
                  style={[
                    styles.monthText,
                    isToday && styles.activeText,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
