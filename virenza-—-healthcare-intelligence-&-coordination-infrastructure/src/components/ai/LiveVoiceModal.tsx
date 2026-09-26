import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, PhoneCall, PhoneOff, Volume2, Sparkles, X, ShieldAlert, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Float32 to 16-bit PCM little endian base64
  const pcmToBase64 = (floats: Float32Array): string => {
    const buffer = new ArrayBuffer(floats.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < floats.length; i++) {
      let s = Math.max(-1, Math.min(1, floats[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Playback 24kHz PCM base64 chunk
  const playAudioChunk = (audioCtx: AudioContext, base64Pcm: string) => {
    try {
      const binary = atob(base64Pcm);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const dataView = new DataView(bytes.buffer);
      const sampleCount = bytes.length / 2;
      const audioBuffer = audioCtx.createBuffer(1, sampleCount, 24000);
      const channelData = audioBuffer.getChannelData(0);

      for (let i = 0; i < sampleCount; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        channelData[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      const currentTime = audioCtx.currentTime;
      const startTime = Math.max(currentTime, nextStartTimeRef.current);
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;

      activeSourcesRef.current.push(source);
      setIsSpeaking(true);

      source.onended = () => {
        const idx = activeSourcesRef.current.indexOf(source);
        if (idx !== -1) activeSourcesRef.current.splice(idx, 1);
        if (activeSourcesRef.current.length === 0) {
          setIsSpeaking(false);
        }
      };
    } catch (err) {
      console.error('Audio chunk playback error:', err);
    }
  };

  const stopAllAudio = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsSpeaking(false);
  };

  const startVoiceSession = async () => {
    setIsConnecting(true);
    setErrorMessage(null);

    try {
      // 1. Microphone capture at 16kHz
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      inputAudioCtxRef.current = inputAudioCtx;

      // 2. Output audio at 24kHz for model audio
      const outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
      outputAudioCtxRef.current = outputAudioCtx;
      nextStartTimeRef.current = outputAudioCtx.currentTime;

      // 3. Connect WebSocket to server
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);

        // Connect mic stream processor
        const sourceNode = inputAudioCtx.createMediaStreamSource(stream);
        const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
        sourceNode.connect(processor);
        processor.connect(inputAudioCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const floatData = e.inputBuffer.getChannelData(0);
            const base64Audio = pcmToBase64(floatData);
            ws.send(JSON.stringify({ audio: base64Audio }));
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setErrorMessage(msg.error);
          }
          if (msg.interrupted) {
            stopAllAudio();
          }
          if (msg.audio && outputAudioCtxRef.current) {
            playAudioChunk(outputAudioCtxRef.current, msg.audio);
          }
        } catch (err) {
          console.error('Error handling live message:', err);
        }
      };

      ws.onerror = () => {
        setErrorMessage('WebSocket connection error. Please ensure the server has GEMINI_API_KEY configured.');
        endVoiceSession();
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };
    } catch (err: any) {
      console.error('Live voice session initialization error:', err);
      setErrorMessage(err.message || 'Microphone access denied or network error.');
      setIsConnecting(false);
      setIsConnected(false);
    }
  };

  const endVoiceSession = () => {
    stopAllAudio();

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => {
      endVoiceSession();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FBFBF7] w-full max-w-lg rounded-2xl border border-[#E7E4DC] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#E7E4DC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2C5530] text-white flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#22241F]">Gemini Live Voice</h3>
                <Badge variant="ai" size="xs">
                  gemini-3.1-flash-live-preview
                </Badge>
              </div>
              <p className="text-[11px] text-[#7A7568]">Real-time bidirectional speech with low latency</p>
            </div>
          </div>

          <button
            onClick={() => {
              endVoiceSession();
              onClose();
            }}
            className="p-1.5 text-[#7A7568] hover:text-[#22241F] hover:bg-[#F4F2EE] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Pulse Arena */}
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            {/* Pulsing Aura Rings */}
            {isConnected && (
              <>
                <div
                  className={`absolute inset-0 rounded-full ${
                    isSpeaking ? 'bg-[#3C7049]/30 animate-ping' : 'bg-[#2C5530]/15 animate-pulse'
                  }`}
                  style={{ animationDuration: isSpeaking ? '1.5s' : '3s' }}
                />
                <div
                  className={`absolute -inset-4 rounded-full ${
                    isSpeaking ? 'bg-[#3C7049]/20 animate-pulse' : 'bg-[#2C5530]/10'
                  }`}
                />
              </>
            )}

            <div
              className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                isConnected
                  ? isSpeaking
                    ? 'bg-[#3C7049] text-white shadow-lg shadow-[#3C7049]/30 scale-105'
                    : 'bg-[#2C5530] text-white shadow-md'
                  : 'bg-[#EAECE6] text-[#7A7568]'
              }`}
            >
              {isConnected ? (
                isSpeaking ? (
                  <Volume2 className="w-12 h-12 animate-bounce" />
                ) : (
                  <Mic className="w-10 h-10 animate-pulse" />
                )
              ) : (
                <MicOff className="w-10 h-10" />
              )}
            </div>
          </div>

          {/* Status Label */}
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[#22241F]">
              {isConnecting
                ? 'Connecting to Gemini Live API...'
                : isConnected
                ? isSpeaking
                  ? 'VIRENZA is speaking...'
                  : 'Listening... Speak naturally.'
                : 'Live Voice Session Disconnected'}
            </h4>
            <p className="text-xs text-[#5A564C] max-w-sm">
              {isConnected
                ? 'Speak symptom descriptions, emergency requests, or care plan queries. Gemini responds instantaneously.'
                : 'Click Connect below to initiate a direct two-way live voice channel with Gemini Live.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-[#FDF2F0] rounded-xl border border-[#F2B8B0] text-xs text-[#B03A28] flex items-center gap-2 max-w-md text-left">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {!isConnected ? (
              <Button
                variant="primary"
                size="md"
                onClick={startVoiceSession}
                disabled={isConnecting}
                leftIcon={<PhoneCall className="w-4 h-4" />}
                className="px-6"
              >
                {isConnecting ? 'Connecting...' : 'Start Live Conversation'}
              </Button>
            ) : (
              <Button
                variant="emergency"
                size="md"
                onClick={endVoiceSession}
                leftIcon={<PhoneOff className="w-4 h-4" />}
                className="px-6"
              >
                End Voice Call
              </Button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#F4F2EE] border-t border-[#E7E4DC] flex items-center justify-between text-[11px] text-[#7A7568]">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#3C7049]' : 'bg-[#B03A28]'}`} />
            <span>PCM 16kHz In • PCM 24kHz Out</span>
          </span>
          <span className="font-mono">model: gemini-3.1-flash-live-preview</span>
        </div>
      </div>
    </div>
  );
};
