from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import torch
from silero_vad import load_silero_vad, read_audio, get_speech_timestamps
from datasets import load_dataset, Audio
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
import joblib
import os
import tempfile

vad_model = load_silero_vad()

def preprocess_audio(audio_path):
    wav = read_audio(audio_path)
    speech_timestamps = get_speech_timestamps(wav, vad_model, return_seconds=True)
    speech = np.concatenate([wav[int(seg['start']*16000):int(seg['end']*16000)] for seg in speech_timestamps])
    return speech

processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
model_ctc = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")

def get_params(audio_path, processor=processor, model_ctc=model_ctc): # throw error if model not initialized
    speech = preprocess_audio(audio_path)
    inputs = processor(speech, sampling_rate=16000, return_tensors="pt")
    logits = model_ctc(**inputs).logits
    probs = torch.softmax(logits, dim=-1)
    entropy = -torch.sum(torch.log(probs+1e-10)*probs, dim=-1)
    return entropy.mean(), entropy.std(), entropy.max(), entropy.median(), torch.quantile(entropy, 0.9)

def get_datapoint(mean, std, maxi, median, quantile):
    data = [[mean, std, maxi, median, quantile]]
    columns = ['mean', 'std', 'max', 'median', 'q90']

    df = pd.DataFrame(data, columns=columns)
    return df

clf_model = joblib.load('slur-detection.joblib')

def prediction(audio_path):
    mean, std, maxi, median, quantile = get_params(audio_path)
    df = get_datapoint(mean, std, maxi, median, quantile)

    prediction = clf_model.predict_proba(df)
    return prediction

app = Flask(__name__)

@app.route('/predict', methods=["POST"])
def predict_route():
    if "audio" not in request.files:
        return jsonify({"error": "No file part found with key 'file'"}), 400
    audio_file = request.files["file"]
    if audio_file.filename=='':
        return jsonify({"error": "No selected file"}), 400
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        audio_path = tmp.name
        audio_file.save(audio_path)

    try:
        prediction_result = prediction(audio_path)
        result = prediction_result.tolist()
        return jsonify({
            "success": True,
            "prediction": result
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)

if __name__ == '__main__':
    app.run(host='0.0', port=3000, debug=True)

