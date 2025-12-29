import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/store/authStore";
import COLORS from "@/constants/color";
import { API_URL } from "@/constants/api";

type Props = {
  onSubmit: (audioUri: string) => void;
};

export default function AudioQuestionCard({ onSubmit }: Props) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("Loading prompt...");
  const [loading, setLoading] = useState(false);

  const { user } = useAuthStore();

 
  const FALLBACK_PROMPTS = [
    "The sun rises in the east and sets in the west.",
    "I feel calm when I take a deep breath.",
    "Learning new skills helps me grow every day.",
    "Speaking clearly makes communication easier.",
    "Today is a good day to stay positive.",
  ];

  useEffect(() => {
    fetchPrompt();
  }, []);

  const fetchPrompt = async () => {
    try {
      const res = await fetch("https://zenquotes.io/api/random");
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.q) {
        setPrompt(data[0].q);
      } else throw new Error();
    } catch {
      setPrompt(FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)]);
    }
  };

 
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (err) {
      console.log("Recording start failed:", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri ?? null);
    setRecording(null);
  };

  
  const submitAudio = async () => {
    if (!audioUri) return;
    setLoading(true);

    try {
      // Send URI directly to parent
      onSubmit(audioUri);
    } catch (err) {
      console.log("Audio submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <View style={{ backgroundColor: COLORS.cardBackground, borderRadius: 16, padding: 24, elevation: 4 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>Read Aloud</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>“{prompt}”</Text>

      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={{ backgroundColor: recording ? "#dc2626" : "#1daec2ff", padding: 14, borderRadius: 10 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          {recording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      {audioUri && (
        <TouchableOpacity onPress={submitAudio} disabled={loading} style={{ marginTop: 20 }}>
          <LinearGradient colors={["#52d4f5", "#1daec2ff"]} style={{ padding: 15, borderRadius: 10, alignItems: "center" }}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "600" }}>Submit Audio Answer</Text>}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

  