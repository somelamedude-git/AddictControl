from flask import Flask, render_template, request
import pandas as pd
import numpy as np
import torch
from silero_vad import load_silero_vad, read_audio, get_speech_timestamps
from datasets import load_dataset, Audio
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC

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


