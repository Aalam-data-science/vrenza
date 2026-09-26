import React, { useState, useRef } from 'react';
import {
  generateMusic,
  createOrEditImage,
  generateVideo,
  checkVideoStatus,
  downloadVideoBlob,
  transcribeAudio,
  groundWithSearch,
  groundWithMaps,
  MusicModel,
} from '../../services/geminiClient';
import { auth, saveGeneratedMedia } from '../../services/firebase';
import {
  Music,
  Image as ImageIcon,
  Video,
  Mic,
  Search,
  MapPin,
  Sparkles,
  Upload,
  Play,
  Pause,
  Download,
  Loader2,
  X,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  FileAudio,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'music' | 'image' | 'video' | 'transcribe' | 'grounding';
}

export const MultimodalStudioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultTab = 'music',
}) => {
  const [activeTab, setActiveTab] = useState<'music' | 'image' | 'video' | 'transcribe' | 'grounding'>(defaultTab);

  // 1. Music State (lyria-3-clip-preview / lyria-3-pro-preview)
  const [musicPrompt, setMusicPrompt] = useState('Calming 432Hz therapeutic frequency soundscape with soft ambient pads for pre-procedure anxiety reduction');
  const [musicModel, setMusicModel] = useState<MusicModel>('lyria-3-clip-preview');
  const [musicImage, setMusicImage] = useState<string | null>(null);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [musicLyrics, setMusicLyrics] = useState<string | null>(null);
  const [musicError, setMusicError] = useState<string | null>(null);

  // 2. Image State (gemini-3.1-flash-image-preview)
  const [imagePrompt, setImagePrompt] = useState('Detailed medical anatomical cross-section of cardiac ventricles showing blood flow pathways, scientific clarity');
  const [inputImageForEdit, setInputImageForEdit] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageTextOutput, setImageTextOutput] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // 3. Video State (veo-3.1-fast-generate-preview)
  const [videoPrompt, setVideoPrompt] = useState('Smooth 3D microscopic animation of cellular oxygenation in healthy lung tissue, cinematic high detail');
  const [inputPhotoForVideo, setInputPhotoForVideo] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatusText, setVideoStatusText] = useState<string | null>(null);
  const [generatedVideoBlobUrl, setGeneratedVideoBlobUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // 4. Transcribe State (gemini-3.5-transcribe)
  const [transcribeAudioBase64, setTranscribeAudioBase64] = useState<string | null>(null);
  const [transcribeAudioName, setTranscribeAudioName] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptResult, setTranscriptResult] = useState<string | null>(null);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 5. Grounding State (Search & Maps with gemini-3.5-flash)
  const [groundingMode, setGroundingMode] = useState<'search' | 'maps'>('search');
  const [groundingPrompt, setGroundingPrompt] = useState('Latest 2026 clinical guidelines for acute myocardial infarction emergency protocol');
  const [isGroundingActive, setIsGroundingActive] = useState(false);
  const [groundingResponse, setGroundingResponse] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  const [groundingError, setGroundingError] = useState<string | null>(null);

  // --- Handlers ---

  // 1. Music Generation
  const handleGenerateMusic = async () => {
    setIsGeneratingMusic(true);
    setMusicError(null);
    setGeneratedAudioUrl(null);
    try {
      const res = await generateMusic({
        prompt: musicPrompt,
        model: musicModel,
        imageBase64: musicImage ? musicImage.split(',')[1] : undefined,
      });

      if (!res.audioBase64) {
        throw new Error('No audio data received from music model');
      }

      // Convert base64 to audio url
      const binary = atob(res.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: res.mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setGeneratedAudioUrl(url);
      setMusicLyrics(res.lyrics);

      // Save to Firestore if authenticated
      if (auth.currentUser) {
        saveGeneratedMedia(auth.currentUser.uid, {
          mediaType: 'music',
          prompt: musicPrompt,
          modelUsed: musicModel,
        }).catch(console.error);
      }
    } catch (err: any) {
      console.error('Music gen error:', err);
      setMusicError(err.message || 'Music generation failed.');
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // 2. Image Create & Edit
  const handleProcessImage = async () => {
    setIsProcessingImage(true);
    setImageError(null);
    setGeneratedImageUrl(null);
    try {
      const inputBase64 = inputImageForEdit ? inputImageForEdit.split(',')[1] : undefined;
      const res = await createOrEditImage({
        prompt: imagePrompt,
        inputImageBase64: inputBase64,
        aspectRatio: imageAspectRatio,
      });

      if (res.imageUrl) {
        setGeneratedImageUrl(res.imageUrl);
      }
      setImageTextOutput(res.text);

      if (auth.currentUser) {
        saveGeneratedMedia(auth.currentUser.uid, {
          mediaType: 'image',
          prompt: imagePrompt,
          modelUsed: 'gemini-3.1-flash-image-preview',
        }).catch(console.error);
      }
    } catch (err: any) {
      console.error('Image error:', err);
      setImageError(err.message || 'Image processing failed.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // 3. Veo 3 Video Generation & Animation
  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoError(null);
    setGeneratedVideoBlobUrl(null);
    setVideoStatusText('Initiating Veo 3 video render operation...');

    try {
      const photoBase64 = inputPhotoForVideo ? inputPhotoForVideo.split(',')[1] : undefined;
      const initRes = await generateVideo({
        prompt: videoPrompt,
        imageBase64: photoBase64,
        aspectRatio: videoAspectRatio,
      });

      const opName = initRes.operationName;
      setVideoStatusText('Veo 3 is generating frames (this may take 1-3 minutes)...');

      // Poll until done
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await checkVideoStatus(opName);
          if (statusRes.done) {
            clearInterval(pollInterval);
            if (statusRes.error) {
              throw new Error(statusRes.error.message || 'Video generation failed');
            }
            setVideoStatusText('Downloading generated video...');
            const videoBlob = await downloadVideoBlob(opName);
            const videoUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoBlobUrl(videoUrl);
            setVideoStatusText(null);
            setIsGeneratingVideo(false);

            if (auth.currentUser) {
              saveGeneratedMedia(auth.currentUser.uid, {
                mediaType: 'video',
                prompt: videoPrompt,
                modelUsed: 'veo-3.1-fast-generate-preview',
              }).catch(console.error);
            }
          } else {
            setVideoStatusText(`Rendering video with Veo 3... (${attempts * 5}s elapsed)`);
          }
        } catch (pollErr: any) {
          clearInterval(pollInterval);
          setVideoError(pollErr.message || 'Error polling video operation.');
          setIsGeneratingVideo(false);
          setVideoStatusText(null);
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setVideoError('Video generation timed out. Please retry.');
          setIsGeneratingVideo(false);
          setVideoStatusText(null);
        }
      }, 5000);
    } catch (err: any) {
      console.error('Video gen error:', err);
      setVideoError(err.message || 'Failed to start Veo video generation.');
      setIsGeneratingVideo(false);
      setVideoStatusText(null);
    }
  };

  // 4. Audio Transcription with gemini-3.5-transcribe
  const handleTranscribe = async () => {
    if (!transcribeAudioBase64) return;
    setIsTranscribing(true);
    setTranscribeError(null);
    try {
      const res = await transcribeAudio({
        audioBase64: transcribeAudioBase64,
        mimeType: 'audio/webm',
        prompt: 'Transcribe this medical / clinical audio with high terminological accuracy.',
      });
      setTranscriptResult(res.transcript);

      if (auth.currentUser) {
        saveGeneratedMedia(auth.currentUser.uid, {
          mediaType: 'transcription',
          prompt: 'Audio Transcription',
          modelUsed: 'gemini-3.5-transcribe',
        }).catch(console.error);
      }
    } catch (err: any) {
      setTranscribeError(err.message || 'Audio transcription failed.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleToggleMicRecord = async () => {
    if (isRecordingMic) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecordingMic(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        setTranscribeAudioName(`Mic Recording (${Math.round(blob.size / 1024)} KB)`);

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const b64 = (reader.result as string).split(',')[1];
          setTranscribeAudioBase64(b64);
        };
      };

      mediaRecorder.start();
      setIsRecordingMic(true);
    } catch (err) {
      alert('Microphone access denied.');
    }
  };

  // 5. Search & Maps Grounding
  const handleGroundingSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!groundingPrompt.trim()) return;

    setIsGroundingActive(true);
    setGroundingError(null);
    setGroundingResponse(null);
    setGroundingSources([]);

    try {
      if (groundingMode === 'search') {
        const res = await groundWithSearch({ prompt: groundingPrompt });
        setGroundingResponse(res.text);
        setGroundingSources(res.sources || []);
      } else {
        const res = await groundWithMaps({ prompt: groundingPrompt });
        setGroundingResponse(res.text);
        setGroundingSources(res.places || []);
      }
    } catch (err: any) {
      setGroundingError(err.message || 'Grounding intelligence query failed.');
    } finally {
      setIsGroundingActive(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FBFBF7] w-full max-w-4xl h-[90vh] max-h-[820px] rounded-2xl border border-[#E7E4DC] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#E7E4DC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2C5530] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#22241F]">VIRENZA Multimodal Intelligence Studio</h3>
              <p className="text-[11px] text-[#7A7568]">Lyria Music • Veo Video • Flash Images • Audio Transcription • Grounding</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#7A7568] hover:text-[#22241F] hover:bg-[#F4F2EE] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="px-5 bg-white border-b border-[#E7E4DC] flex items-center gap-2 overflow-x-auto text-xs font-medium scrollbar-none">
          {[
            { id: 'music', label: 'Music & Audio (Lyria 3)', icon: Music },
            { id: 'image', label: 'Create & Edit Images', icon: ImageIcon },
            { id: 'video', label: 'Veo 3 Video Studio', icon: Video },
            { id: 'transcribe', label: 'Transcribe Speech', icon: Mic },
            { id: 'grounding', label: 'Search & Maps Grounding', icon: Search },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#2C5530] text-[#2C5530] font-semibold'
                    : 'border-transparent text-[#7A7568] hover:text-[#22241F]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: MUSIC GENERATION (LYRIA) */}
          {activeTab === 'music' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-3 bg-[#EAECE6] rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#2C5530]">
                  <Music className="w-4 h-4" />
                  <span>Google DeepMind Lyria 3 Generation</span>
                </div>
                <p className="text-[11px] text-[#5A564C]">
                  Generate therapeutic audio frequencies, guided recovery soundscapes, or calming ambient tracks using{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-mono">lyria-3-clip-preview</code> (up to 30s) or{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-mono">lyria-3-pro-preview</code> (full tracks).
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#22241F] block mb-1">Model Selection:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'lyria-3-clip-preview', label: 'Lyria 3 Clip Preview', desc: 'Short clips (up to 30s) for focused therapeutic loops' },
                      { id: 'lyria-3-pro-preview', label: 'Lyria 3 Pro Preview', desc: 'Full-length tracks for extended clinical recovery' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMusicModel(m.id as MusicModel)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          musicModel === m.id
                            ? 'bg-white border-[#2C5530] ring-1 ring-[#2C5530]'
                            : 'bg-white/60 border-[#E7E4DC] hover:bg-white'
                        }`}
                      >
                        <div className="font-semibold text-[#22241F]">{m.label}</div>
                        <div className="text-[10px] text-[#7A7568] mt-0.5">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#22241F] block mb-1">Therapeutic Audio Prompt:</label>
                  <textarea
                    rows={3}
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    placeholder="Describe tone, instruments, BPM, therapeutic focus..."
                    className="w-full p-3 text-xs rounded-xl border border-[#E7E4DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5530]"
                  />
                </div>

                {/* Optional Image Context for Music */}
                <div>
                  <label className="text-xs font-semibold text-[#22241F] block mb-1">Optional Inspiration Image:</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      id="music-img-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setMusicImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="music-img-upload"
                      className="px-3 py-1.5 rounded-lg border border-[#E7E4DC] bg-white text-xs text-[#5A564C] hover:bg-[#F4F2EE] cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{musicImage ? 'Replace Image' : 'Attach Image for Mood'}</span>
                    </label>
                    {musicImage && (
                      <div className="flex items-center gap-2">
                        <img src={musicImage} alt="Mood reference" className="w-8 h-8 object-cover rounded border border-[#E7E4DC]" />
                        <button onClick={() => setMusicImage(null)} className="text-xs text-[#B03A28] hover:underline">
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleGenerateMusic}
                  disabled={isGeneratingMusic || !musicPrompt.trim()}
                  leftIcon={isGeneratingMusic ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
                  className="w-full"
                >
                  {isGeneratingMusic ? 'Synthesizing with Lyria 3...' : `Generate Track with ${musicModel}`}
                </Button>
              </div>

              {musicError && (
                <div className="p-3 bg-[#FDF2F0] text-[#B03A28] text-xs rounded-xl border border-[#F2B8B0]">
                  {musicError}
                </div>
              )}

              {generatedAudioUrl && (
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DC] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#22241F] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3C7049]" />
                      <span>Lyria 3 Generated Audio Ready</span>
                    </span>
                    <Badge variant="clinical" size="xs">
                      {musicModel}
                    </Badge>
                  </div>

                  <audio controls src={generatedAudioUrl} className="w-full" autoPlay />

                  {musicLyrics && (
                    <div className="p-2.5 bg-[#F4F2EE] rounded-lg text-[11px] text-[#5A564C] italic">
                      "{musicLyrics}"
                    </div>
                  )}

                  <a
                    href={generatedAudioUrl}
                    download="virenza_therapeutic_audio.wav"
                    className="inline-flex items-center gap-1.5 text-xs text-[#2C5530] font-semibold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download WAV File</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE & EDIT IMAGES (gemini-3.1-flash-image-preview) */}
          {activeTab === 'image' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-3 bg-[#EAECE6] rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#2C5530]">
                  <ImageIcon className="w-4 h-4" />
                  <span>Gemini 3.1 Flash Image Lab</span>
                </div>
                <p className="text-[11px] text-[#5A564C]">
                  Create medical visual illustrations from text prompts or upload existing clinical images to edit and enhance using{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-mono">gemini-3.1-flash-image-preview</code>.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#22241F] block mb-1">
                    {inputImageForEdit ? 'Image Edit Instructions:' : 'Image Creation Prompt:'}
                  </label>
                  <textarea
                    rows={3}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="e.g. Detailed medical illustration of human cardiac anatomical structures with clear vascular labels"
                    className="w-full p-3 text-xs rounded-xl border border-[#E7E4DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5530]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Upload photo for editing */}
                  <div>
                    <label className="text-xs font-semibold text-[#22241F] block mb-1">Upload Photo to Edit (Optional):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        id="img-edit-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setInputImageForEdit(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="img-edit-upload"
                        className="px-3 py-1.5 rounded-lg border border-[#E7E4DC] bg-white text-xs text-[#5A564C] hover:bg-[#F4F2EE] cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{inputImageForEdit ? 'Change Source' : 'Upload Image to Edit'}</span>
                      </label>
                      {inputImageForEdit && (
                        <button onClick={() => setInputImageForEdit(null)} className="text-xs text-[#B03A28] hover:underline">
                          Clear
                        </button>
                      )}
                    </div>
                    {inputImageForEdit && (
                      <img
                        src={inputImageForEdit}
                        alt="Source to edit"
                        className="mt-2 w-20 h-20 object-cover rounded-lg border border-[#E7E4DC]"
                      />
                    )}
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <label className="text-xs font-semibold text-[#22241F] block mb-1">Aspect Ratio:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['1:1', '4:3', '3:4', '16:9', '9:16'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setImageAspectRatio(ratio)}
                          className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                            imageAspectRatio === ratio
                              ? 'bg-[#2C5530] text-white'
                              : 'bg-white border border-[#E7E4DC] text-[#5A564C]'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleProcessImage}
                  disabled={isProcessingImage || !imagePrompt.trim()}
                  leftIcon={isProcessingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  className="w-full"
                >
                  {isProcessingImage
                    ? 'Processing Image with Gemini 3.1 Flash...'
                    : inputImageForEdit
                    ? 'Edit Image with gemini-3.1-flash-image-preview'
                    : 'Create Image with gemini-3.1-flash-image-preview'}
                </Button>
              </div>

              {imageError && (
                <div className="p-3 bg-[#FDF2F0] text-[#B03A28] text-xs rounded-xl border border-[#F2B8B0]">
                  {imageError}
                </div>
              )}

              {generatedImageUrl && (
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DC] shadow-sm space-y-3 text-center">
                  <div className="flex items-center justify-between text-left">
                    <span className="text-xs font-semibold text-[#22241F] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3C7049]" />
                      <span>Clinical Illustration Output</span>
                    </span>
                    <Badge variant="clinical" size="xs">
                      gemini-3.1-flash-image-preview
                    </Badge>
                  </div>

                  <img
                    src={generatedImageUrl}
                    alt="Generated Clinical Output"
                    className="max-h-[380px] w-auto mx-auto rounded-lg border border-[#E7E4DC] object-contain shadow-xs"
                    referrerPolicy="no-referrer"
                  />

                  {imageTextOutput && (
                    <p className="text-xs text-[#5A564C] text-left">{imageTextOutput}</p>
                  )}

                  <a
                    href={generatedImageUrl}
                    download="virenza_medical_illustration.png"
                    className="inline-flex items-center gap-1.5 text-xs text-[#2C5530] font-semibold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download High-Res PNG</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VEO 3 VIDEO STUDIO (veo-3.1-fast-generate-preview) */}
          {activeTab === 'video' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-3 bg-[#EAECE6] rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#2C5530]">
                  <Video className="w-4 h-4" />
                  <span>Veo 3 Video Studio & Image Animation</span>
                </div>
                <p className="text-[11px] text-[#5A564C]">
                  Generate cinematic clinical video from text or upload a photo to animate it using{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-mono">veo-3.1-fast-generate-preview</code> in{' '}
                  <strong>16:9</strong> (landscape) or <strong>9:16</strong> (portrait).
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#22241F] block mb-1">
                    {inputPhotoForVideo ? 'Animation Motion Prompt:' : 'Video Generation Prompt:'}
                  </label>
                  <textarea
                    rows={3}
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="Describe physiological motion, medical demonstration, or 3D surgical visualization..."
                    className="w-full p-3 text-xs rounded-xl border border-[#E7E4DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5530]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Photo-to-Video Upload */}
                  <div>
                    <label className="text-xs font-semibold text-[#22241F] block mb-1">
                      Upload Photo to Animate (Photo-to-Video):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        id="video-photo-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setInputPhotoForVideo(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="video-photo-upload"
                        className="px-3 py-1.5 rounded-lg border border-[#E7E4DC] bg-white text-xs text-[#5A564C] hover:bg-[#F4F2EE] cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{inputPhotoForVideo ? 'Change Photo' : 'Upload Photo to Animate'}</span>
                      </label>
                      {inputPhotoForVideo && (
                        <button onClick={() => setInputPhotoForVideo(null)} className="text-xs text-[#B03A28] hover:underline">
                          Clear
                        </button>
                      )}
                    </div>
                    {inputPhotoForVideo && (
                      <img
                        src={inputPhotoForVideo}
                        alt="Photo to animate"
                        className="mt-2 w-20 h-20 object-cover rounded-lg border border-[#E7E4DC]"
                      />
                    )}
                  </div>

                  {/* Aspect Ratio: 16:9 or 9:16 per instructions */}
                  <div>
                    <label className="text-xs font-semibold text-[#22241F] block mb-1">Aspect Ratio:</label>
                    <div className="flex gap-2">
                      {[
                        { id: '16:9', label: '16:9 Landscape' },
                        { id: '9:16', label: '9:16 Portrait' },
                      ].map((ar) => (
                        <button
                          key={ar.id}
                          type="button"
                          onClick={() => setVideoAspectRatio(ar.id as '16:9' | '9:16')}
                          className={`flex-1 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                            videoAspectRatio === ar.id
                              ? 'bg-[#2C5530] text-white border-[#2C5530]'
                              : 'bg-white border-[#E7E4DC] text-[#5A564C]'
                          }`}
                        >
                          {ar.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo || !videoPrompt.trim()}
                  leftIcon={isGeneratingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                  className="w-full"
                >
                  {isGeneratingVideo
                    ? 'Veo 3 Video Pipeline Active...'
                    : inputPhotoForVideo
                    ? 'Animate Photo into Video with veo-3.1-fast-generate-preview'
                    : 'Generate Video from Text with veo-3.1-fast-generate-preview'}
                </Button>
              </div>

              {isGeneratingVideo && (
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DC] shadow-xs text-xs space-y-2 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#2C5530] mx-auto" />
                  <p className="font-semibold text-[#22241F]">{videoStatusText || 'Generating Veo 3 Video...'}</p>
                  <p className="text-[11px] text-[#7A7568]">
                    Video synthesis uses the multi-stage Veo 3 pipeline. Your video will stream directly into the player upon completion.
                  </p>
                </div>
              )}

              {videoError && (
                <div className="p-3 bg-[#FDF2F0] text-[#B03A28] text-xs rounded-xl border border-[#F2B8B0]">
                  {videoError}
                </div>
              )}

              {generatedVideoBlobUrl && (
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DC] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#22241F] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3C7049]" />
                      <span>Veo 3 Generated Video Ready</span>
                    </span>
                    <Badge variant="clinical" size="xs">
                      veo-3.1-fast-generate-preview ({videoAspectRatio})
                    </Badge>
                  </div>

                  <video
                    controls
                    src={generatedVideoBlobUrl}
                    className="w-full max-h-[380px] rounded-lg border border-[#E7E4DC] bg-black"
                    autoPlay
                  />

                  <a
                    href={generatedVideoBlobUrl}
                    download={`virenza_veo_video_${videoAspectRatio.replace(':', 'x')}.mp4`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#2C5530] font-semibold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4 Video</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TRANSCRIBE AUDIO (gemini-3.5-transcribe) */}
          {activeTab === 'transcribe' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-3 bg-[#EAECE6] rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#2C5530]">
                  <Mic className="w-4 h-4" />
                  <span>Clinical Speech Transcription</span>
                </div>
                <p className="text-[11px] text-[#5A564C]">
                  Record your microphone or upload pre-recorded audio files for accurate clinical transcription using{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-mono">gemini-3.5-transcribe</code>.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-[#E7E4DC] text-center space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={handleToggleMicRecord}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isRecordingMic
                        ? 'bg-[#B03A28] text-white animate-pulse ring-4 ring-[#B03A28]/20'
                        : 'bg-[#2C5530] text-white hover:bg-[#234426]'
                    }`}
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-[#22241F]">
                    {isRecordingMic ? 'Recording audio from microphone...' : 'Click to Record Microphone'}
                  </h5>
                  <p className="text-[11px] text-[#7A7568] mt-0.5">
                    {isRecordingMic ? 'Click button again when finished speaking' : 'Or upload an existing audio file (.webm, .wav, .mp3)'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <input
                    type="file"
                    accept="audio/*"
                    id="audio-file-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setTranscribeAudioName(`${file.name} (${Math.round(file.size / 1024)} KB)`);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const b64 = (reader.result as string).split(',')[1];
                          setTranscribeAudioBase64(b64);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="audio-file-upload"
                    className="px-3 py-1.5 rounded-lg border border-[#E7E4DC] bg-[#F4F2EE] text-xs text-[#5A564C] hover:bg-[#EAECE6] cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Audio File</span>
                  </label>
                </div>

                {transcribeAudioName && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EAECE6] rounded-lg text-xs font-mono text-[#2C5530]">
                    <FileAudio className="w-3.5 h-3.5" />
                    <span>{transcribeAudioName}</span>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleTranscribe}
                  disabled={isTranscribing || !transcribeAudioBase64}
                  leftIcon={isTranscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  className="w-full"
                >
                  {isTranscribing ? 'Transcribing with gemini-3.5-transcribe...' : 'Transcribe Audio with gemini-3.5-transcribe'}
                </Button>
              </div>

              {transcribeError && (
                <div className="p-3 bg-[#FDF2F0] text-[#B03A28] text-xs rounded-xl border border-[#F2B8B0]">
                  {transcribeError}
                </div>
              )}

              {transcriptResult && (
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DC] shadow-sm space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#22241F] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3C7049]" />
                      <span>Accurate Transcript Output</span>
                    </span>
                    <Badge variant="clinical" size="xs">
                      gemini-3.5-transcribe
                    </Badge>
                  </div>
                  <p className="text-xs text-[#22241F] whitespace-pre-wrap leading-relaxed bg-[#FBFBF7] p-3 rounded-lg border border-[#E7E4DC]">
                    {transcriptResult}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SEARCH & MAPS GROUNDING (gemini-3.5-flash) */}
          {activeTab === 'grounding' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-3 bg-[#EAECE6] rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#2C5530]">
                  <Search className="w-4 h-4" />
                  <span>Verified Grounding Intelligence</span>
                </div>
                <p className="text-[11px] text-[#5A564C]">
                  Ground AI responses using real-time Google Search data or Google Maps facility data using{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-mono">gemini-3.5-flash</code> with{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-mono">googleSearch</code> /{' '}
                  <code className="bg-white/80 px-1 py-0.5 rounded font-mono">googleMaps</code> tools.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setGroundingMode('search')}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                    groundingMode === 'search'
                      ? 'bg-[#2C5530] text-white border-[#2C5530]'
                      : 'bg-white border-[#E7E4DC] text-[#5A564C]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Google Search Grounding</span>
                </button>
                <button
                  onClick={() => setGroundingMode('maps')}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                    groundingMode === 'maps'
                      ? 'bg-[#2C5530] text-white border-[#2C5530]'
                      : 'bg-white border-[#E7E4DC] text-[#5A564C]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps Grounding</span>
                </button>
              </div>

              <form onSubmit={handleGroundingSearch} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#22241F] block mb-1">
                    {groundingMode === 'search'
                      ? 'Query for Web Grounding (e.g. Clinical trials, FDA updates):'
                      : 'Query for Maps Grounding (e.g. Trauma centers, urgent care clinics):'}
                  </label>
                  <textarea
                    rows={2}
                    value={groundingPrompt}
                    onChange={(e) => setGroundingPrompt(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-[#E7E4DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5530]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isGroundingActive || !groundingPrompt.trim()}
                  leftIcon={isGroundingActive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  className="w-full"
                >
                  {isGroundingActive
                    ? 'Retrieving Grounded Data...'
                    : groundingMode === 'search'
                    ? 'Execute Search Grounding (gemini-3.5-flash)'
                    : 'Execute Maps Grounding (gemini-3.5-flash)'}
                </Button>
              </form>

              {groundingError && (
                <div className="p-3 bg-[#FDF2F0] text-[#B03A28] text-xs rounded-xl border border-[#F2B8B0]">
                  {groundingError}
                </div>
              )}

              {groundingResponse && (
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DC] shadow-sm space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#22241F] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3C7049]" />
                      <span>Verified Grounded Response</span>
                    </span>
                    <Badge variant="clinical" size="xs">
                      gemini-3.5-flash + {groundingMode === 'search' ? 'googleSearch' : 'googleMaps'}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#22241F] whitespace-pre-wrap leading-relaxed">
                    {groundingResponse}
                  </p>

                  {/* Sources / Citations */}
                  {groundingSources && groundingSources.length > 0 && (
                    <div className="pt-2 border-t border-[#E7E4DC] space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#7A7568] uppercase tracking-wider block">
                        Verified Citations & References:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {groundingSources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-[#F4F2EE] hover:bg-[#EAECE6] rounded-md text-[11px] text-[#2C5530] font-medium truncate max-w-xs transition-colors"
                          >
                            {s.title || s.url || `Citation [${idx + 1}]`}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
