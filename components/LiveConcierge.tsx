
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const LiveConcierge: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('Standby');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // PCM Encoding/Decoding Helpers
  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('Listening');
            const source = audioContextRef.current!.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
               const text = message.serverContent.outputTranscription.text;
               setTranscription(prev => [...prev.slice(-4), `AI: ${text}`]);
            }
            if (message.serverContent?.inputTranscription) {
               const text = message.serverContent.inputTranscription.text;
               setTranscription(prev => [...prev.slice(-4), `You: ${text}`]);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live Error:', e);
            setStatus('Error');
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Standby');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'You are the Project Picasso Rewards Concierge. Help users optimize their credit card rewards with a professional, friendly voice.',
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        }
      });

    } catch (err) {
      console.error(err);
      setStatus('Access Denied');
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('Standby');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">AI Concierge</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Speak naturally to your financial assistant. Ask about reward categories, card balances, or optimization tips.
        </p>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Animated Orbs */}
        <div className={`absolute inset-0 rounded-full bg-indigo-500/20 animate-ping ${isActive ? 'duration-[3s]' : 'hidden'}`}></div>
        <div className={`absolute inset-4 rounded-full bg-indigo-500/30 animate-pulse ${isActive ? '' : 'hidden'}`}></div>
        
        <button
          onClick={isActive ? stopSession : startSession}
          className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-4 ${
            isActive 
              ? 'bg-rose-500 border-rose-400 shadow-2xl shadow-rose-500/40 scale-105' 
              : 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-600/40 hover:scale-105'
          }`}
        >
          <svg className="h-16 w-16 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isActive ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            )}
          </svg>
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            {isActive ? 'Stop Agent' : 'Activate AI'}
          </span>
        </button>

        {/* Status Indicator */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{status}</span>
        </div>
      </div>

      {/* Transcription Preview */}
      <div className="w-full max-w-lg bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[160px] flex flex-col justify-end">
        {transcription.length === 0 ? (
          <p className="text-slate-300 text-sm italic text-center mb-10">Real-time transcription will appear here...</p>
        ) : (
          <div className="space-y-3">
            {transcription.map((line, i) => (
              <p key={i} className={`text-sm ${line.startsWith('You:') ? 'text-indigo-600 font-bold' : 'text-slate-600 font-medium'}`}>
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
        Powered by Gemini 2.5 Flash Native Audio
      </p>
    </div>
  );
};

export default LiveConcierge;
