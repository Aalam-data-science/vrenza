import React, { useState, useRef, useEffect } from 'react';
import {
  ChatMessage,
  ChatModel,
  chatWithGemini,
  transcribeAudio,
} from '../../services/geminiClient';
import { auth, saveConsultationRecord } from '../../services/firebase';
import {
  MessageSquare,
  Send,
  Sparkles,
  Zap,
  BrainCircuit,
  Mic,
  MicOff,
  RotateCcw,
  Loader2,
  X,
  Bot,
  User,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface RoleConfig {
  id: string;
  name: string;
  badge: string;
  defaultModel: ChatModel;
  systemInstruction: string;
  welcomeMessage: string;
}

const ROLES: RoleConfig[] = [
  {
    id: 'general',
    name: 'General Health Navigator',
    badge: 'General Tasks',
    defaultModel: 'gemini-3.5-flash',
    systemInstruction:
      'You are VIRENZA General Health Navigator powered by gemini-3.5-flash. You assist patients and care teams with healthcare coordination, medication guidance, triage clarity, and preventative insights in compassionate language.',
    welcomeMessage:
      'Hello, I am your VIRENZA Health Navigator (gemini-3.5-flash). How can I assist with your care plan, symptoms, or clinical coordination today?',
  },
  {
    id: 'complex',
    name: 'Complex Clinical Decision Support',
    badge: 'Complex Reasoning',
    defaultModel: 'gemini-3.1-pro-preview',
    systemInstruction:
      'You are VIRENZA Clinical Decision Support powered by gemini-3.1-pro-preview. You provide deep diagnostic differentials, pharmacological cross-analysis, hemodynamic trend evaluation, and evidence-grounded treatment protocol recommendations.',
    welcomeMessage:
      'Clinical Decision Support initialized with gemini-3.1-pro-preview. Input complex multi-system presentation, differential dilemmas, or polypharmacy interactions for high-rigor clinical evaluation.',
  },
  {
    id: 'fast',
    name: 'Rapid Emergency & Bedside Triage',
    badge: 'Ultra-Fast Response',
    defaultModel: 'gemini-3.1-flash-lite',
    systemInstruction:
      'You are VIRENZA Rapid Bedside Triage assistant powered by gemini-3.1-flash-lite. You deliver instantaneous, concise, structured triaging assessments and quick checklist protocols without latency.',
    welcomeMessage:
      'Rapid Triage online (gemini-3.1-flash-lite). State patient acuity, primary complaint, or urgent bedside question for instant guidance.',
  },
];

export const GeminiChatbotModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<RoleConfig>(ROLES[0]);
  const [model, setModel] = useState<ChatModel>(ROLES[0].defaultModel);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: ROLES[0].welcomeMessage },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [customInstruction, setCustomInstruction] = useState('');
  const [showRoleSettings, setShowRoleSettings] = useState(false);
  const [savedToFirestore, setSavedToFirestore] = useState(false);

  const threadEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleRoleChange = (role: RoleConfig) => {
    setSelectedRole(role);
    setModel(role.defaultModel);
    setMessages([{ role: 'assistant', content: role.welcomeMessage }]);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputValue.trim();
    if (!prompt || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const activeInstruction = customInstruction.trim() || selectedRole.systemInstruction;
      const res = await chatWithGemini({
        messages: newMessages,
        systemInstruction: activeInstruction,
        model,
      });

      const updated = [...newMessages, { role: 'assistant', content: res.text } as ChatMessage];
      setMessages(updated);

      // Auto-persist to Firestore if user is authenticated
      const currentUser = auth.currentUser;
      if (currentUser) {
        saveConsultationRecord(currentUser.uid, {
          title: `Consultation (${selectedRole.name})`,
          type: selectedRole.id,
          messages: updated,
          summary: res.text.slice(0, 160),
        })
          .then(() => setSavedToFirestore(true))
          .catch(() => {});
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Consultation system notice: ${err.message || 'Unable to reach Gemini model.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Dictation with gemini-3.5-transcribe
  const handleToggleVoiceDictation = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          if (!base64Data) return;

          setIsLoading(true);
          try {
            const transResult = await transcribeAudio({
              audioBase64: base64Data,
              mimeType: 'audio/webm',
              prompt: 'Transcribe this voice consultation query clearly for clinical reasoning.',
            });
            if (transResult.transcript) {
              setInputValue((prev) => (prev ? `${prev} ${transResult.transcript}` : transResult.transcript));
            }
          } catch (err: any) {
            console.error('Transcription failed:', err);
          } finally {
            setIsLoading(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access was denied. Please allow microphone permissions in your browser.');
    }
  };

  const handleResetChat = () => {
    setMessages([{ role: 'assistant', content: selectedRole.welcomeMessage }]);
    setSavedToFirestore(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FBFBF7] w-full max-w-3xl h-[88vh] max-h-[760px] rounded-2xl border border-[#E7E4DC] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#E7E4DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2C5530] text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#22241F]">VIRENZA Gemini Clinical Chat</h3>
                <Badge variant="clinical" size="xs">
                  {model}
                </Badge>
              </div>
              <p className="text-[11px] text-[#7A7568]">Multi-turn clinical intelligence & role-based reasoning</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRoleSettings(!showRoleSettings)}
              className="px-2.5 py-1 text-xs font-medium text-[#5A564C] hover:text-[#22241F] bg-[#F4F2EE] hover:bg-[#EAECE6] rounded-md transition-colors"
            >
              Role & System
            </button>
            <button
              onClick={handleResetChat}
              title="Reset Conversation"
              className="p-1.5 text-[#7A7568] hover:text-[#22241F] hover:bg-[#F4F2EE] rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#7A7568] hover:text-[#22241F] hover:bg-[#F4F2EE] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role & Model Configuration Drawer */}
        {showRoleSettings && (
          <div className="p-4 bg-[#F4F2EE] border-b border-[#E7E4DC] text-xs space-y-3 animate-in slide-in-from-top duration-200">
            <div>
              <label className="font-semibold text-[#22241F] block mb-1">Select Persona & Role:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleChange(role)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedRole.id === role.id
                        ? 'bg-white border-[#2C5530] ring-1 ring-[#2C5530] shadow-xs'
                        : 'bg-white/70 border-[#E7E4DC] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-[#22241F]">
                      <span>{role.name}</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#3C7049] mt-0.5">{role.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#22241F]">Target Gemini Model:</span>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as ChatModel)}
                  className="px-2 py-1 text-xs rounded border border-[#E7E4DC] bg-white"
                >
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Tasks)</option>
                  <option value="gemini-3.5-flash">gemini-3.5-flash (General Tasks)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fastest)</option>
                </select>
              </div>

              {savedToFirestore && (
                <div className="flex items-center gap-1 text-[11px] text-[#3C7049]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Syncing to Firestore Vault</span>
                </div>
              )}
            </div>

            <div>
              <label className="font-semibold text-[#22241F] block mb-1">Custom System Instruction (Override):</label>
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder={selectedRole.systemInstruction}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E7E4DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5530]"
              />
            </div>
          </div>
        )}

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                  msg.role === 'user'
                    ? 'bg-[#2C5530] text-white font-medium'
                    : 'bg-white text-[#2C5530] border border-[#E7E4DC] shadow-xs'
                }`}
              >
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#2C5530] text-white rounded-tr-xs'
                    : 'bg-white text-[#22241F] border border-[#E7E4DC] rounded-tl-xs shadow-xs whitespace-pre-wrap'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center text-xs text-[#7A7568]">
              <div className="w-7 h-7 rounded-full bg-white border border-[#E7E4DC] flex items-center justify-center shrink-0">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2C5530]" />
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E7E4DC] shadow-xs flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2C5530] animate-pulse" />
                <span>{model} is synthesizing clinical guidance...</span>
              </div>
            </div>
          )}

          <div ref={threadEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-[#E7E4DC]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoiceDictation}
              title={isRecording ? 'Stop Recording' : 'Dictate with gemini-3.5-transcribe'}
              className={`p-2.5 rounded-xl transition-all ${
                isRecording
                  ? 'bg-[#B03A28] text-white animate-pulse'
                  : 'bg-[#F4F2EE] text-[#5A564C] hover:bg-[#EAECE6] hover:text-[#22241F]'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message ${selectedRole.name} (${model})...`}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-xs rounded-xl border border-[#E7E4DC] bg-[#FBFBF7] focus:outline-none focus:ring-1 focus:ring-[#2C5530] focus:bg-white"
            />

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isLoading || !inputValue.trim()}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send
            </Button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#7A7568] px-1 mt-1.5">
            <span>Powered by Google Gemini • Multi-turn conversation preserved</span>
            <span>Mic uses gemini-3.5-transcribe</span>
          </div>
        </form>
      </div>
    </div>
  );
};
