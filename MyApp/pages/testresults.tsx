import { Text, View, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground } from "react-native";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TestResults = ({ navigation }: any) => {
  const [results, setResults] = useState<any[]>([]);
  const [limit] = useState(3);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    getResults();
  }, [page]);

  const getResults = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/test/see_results", {
        params: { limit, page },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);
      if (page === 1) setResults(response.data.test_results);
      else setResults(prev => [...prev, ...response.data.test_results]);

      setHasNextPage(response.data.hasNextPage);
    } catch (err) {
      console.log("Error fetching results:", err);
    }
  };

  const loadMore = () => {
    if (hasNextPage) setPage(prev => prev + 1);
  };

  return (
    <ImageBackground
      source={require('../components/assets/images/bg.jpg')}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Go Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Test History</Text>
            <View style={{ width: 70 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {results.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No test results recorded yet.</Text>
              </View>
            ) : (
              results.map((r, i) => (
                <View key={i} style={styles.resultCard}>
                  <View style={styles.cardHeader}>
                    {/* Status Indicator logic: attempt=true means passed the screening? Source assumed attempted=pass. Target just shows attempted. */}
                    <View style={[styles.statusIndicator, { backgroundColor: r.attempted ? '#4A61AF' : '#fab1a0' }]} />
                    <Text style={styles.dateText}>{new Date(r.createdAt).toLocaleDateString()} • {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>

                  <View style={styles.scoresRow}>
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreLabel}>VOICE</Text>
                      <Text style={styles.scoreValue}>{r.voice_score}</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreLabel}>LOGIC</Text>
                      <Text style={styles.scoreValue}>{r.logical_reasoning_score}</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreLabel}>STATUS</Text>
                      <Text style={[styles.scoreValue, { color: r.attempted ? '#4A61AF' : '#d63031', fontSize: 14 }]}>{r.attempted ? "Done" : "Inc"}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}

            {hasNextPage && (
              <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
                <Text style={styles.loadMoreText}>Load More</Text>
              </TouchableOpacity>
            )}

            {/* Spacer for Navbar */}
            <View style={{ height: 80 }} />

          </ScrollView>

          {/* Navbar Fixed Bottom */}
          <View style={styles.navBarWrapper}>
            <Navbar navigation={navigation} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

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
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  backButtonText: {
    color: '#2d3436',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  scrollContent: {
    padding: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#ccc',
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  dateText: {
    color: '#b2bec3',
    fontSize: 12,
    fontWeight: '500',
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#b2bec3',
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d3436',
  },
  verticalDivider: {
    width: 1,
    height: 25,
    backgroundColor: '#dfe6e9',
  },
  loadMoreButton: {
    padding: 15,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#4A61AF',
    fontWeight: '600',
  },
  navBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  }
});

export default TestResults;
