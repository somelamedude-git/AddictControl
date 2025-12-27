import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import COLORS from '@/constants/color';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  onSubmit: (uri: string) => void;
};

export default function AudioQuestionCard({ onSubmit }: Props) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Loading prompt...');

  useEffect(() => {
  fetchPrompt();
}, []);

  const FALLBACK_PROMPTS = [
  "The sun rises in the east and sets in the west.",
  "I feel calm when I take a deep breath.",
  "Learning new skills helps me grow every day.",
  "Speaking clearly makes communication easier.",
  "Today is a good day to stay positive.",
];

const fetchPrompt = async () => {
  try {
    const response = await fetch('https://zenquotes.io/api/random', {
      headers: {
        Accept: 'application/json',
      },
    });

    const text = await response.text();

    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Non-JSON response');
    }

    if (
      Array.isArray(data) &&
      data.length > 0 &&
      typeof data[0]?.q === 'string'
    ) {
      setPrompt(data[0].q);
      return;
    }

    throw new Error('Invalid response shape');
  } catch (error) {
    console.log('Prompt fetch failed, using fallback:', error);

    const randomFallback =
      FALLBACK_PROMPTS[
        Math.floor(Math.random() * FALLBACK_PROMPTS.length)
      ];

    setPrompt(randomFallback);
  }
};



  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.log('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    setAudioUri(uri || null);
    setRecording(null);
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 24,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: COLORS.border,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10 }}>
        Read Aloud
      </Text>

      {/*  Dynamic Prompt */}
      <Text
        style={{
          fontSize: 16,
          lineHeight: 24,
          color: COLORS.textPrimary,
          marginBottom: 20,
        }}
      >
        “{prompt}”
      </Text>

      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={{
          backgroundColor: recording ? '#dc2626' : '#1daec2ff',
          padding: 14,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {audioUri && (
        <TouchableOpacity
          onPress={() => onSubmit(audioUri)}
          style={{ marginTop: 20, borderRadius: 10, overflow: 'hidden' }}
        >
          <LinearGradient
            colors={['#52d4f5', '#1daec2ff']}
            start={[0, 0]}
            end={[1, 1]}
            style={{ padding: 15, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>
              Submit Audio Answer
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}
