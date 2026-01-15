import { Text, View, ScrollView, Button } from "react-native";
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
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Test Results</Text>
      <ScrollView>
        {results.length === 0 ? (
          <Text>No results yet</Text>
        ) : (
          results.map((r, i) => (
            <View key={i} style={{ marginBottom: 15 }}>
              <Text>Attempt: {r.attempted ? "Yes": "No"}</Text>
              <Text>Attempt: {r.voice_score}</Text>
              <Text>Attempt: {r.logical_reasoning_score}</Text>
              <Text>Date: {new Date(r.createdAt).toLocaleString()}</Text>
            </View>
          ))
        )}
        {hasNextPage && <Button title="Load More" onPress={loadMore} />}
      </ScrollView>
      <Navbar navigation={navigation} />
    </View>
  );
};

export default TestResults;
