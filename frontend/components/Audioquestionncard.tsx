import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useState } from 'react';

type Props = {
  onSubmit: (uri: string) => void;
};

export default function AudioQuestionCard({ onSubmit }: Props) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);

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
        backgroundColor: '#d1f4fdf3',
        padding: 20,
        borderRadius: 16,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600' }}>
        Final Question
      </Text>

      <Text style={{ marginTop: 10 }}>
        Please answer this question using your voice.
      </Text>

      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={{
          backgroundColor: recording ? '#dc2626' : '#00bcd4',
          padding: 14,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {audioUri && (
        <TouchableOpacity
          onPress={() => onSubmit(audioUri)}
          style={{
            backgroundColor: '#00bcd4',
            padding: 14,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            Submit Audio Answer
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
