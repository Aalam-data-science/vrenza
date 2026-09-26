// Frontend service to call server-side Gemini API endpoints

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type ChatModel = 'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite';

export async function chatWithGemini(params: {
  messages: ChatMessage[];
  systemInstruction?: string;
  model?: ChatModel;
}): Promise<{ text: string; model: string }> {
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Chat request failed');
  }

  return res.json();
}

export async function groundWithSearch(params: {
  prompt: string;
  systemInstruction?: string;
}): Promise<{
  text: string;
  sources: Array<{ title: string; url: string }>;
  metadata?: any;
}> {
  const res = await fetch('/api/gemini/search-grounding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Search grounding request failed');
  }

  return res.json();
}

export async function groundWithMaps(params: {
  prompt: string;
  systemInstruction?: string;
}): Promise<{
  text: string;
  places: any[];
  metadata?: any;
}> {
  const res = await fetch('/api/gemini/maps-grounding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Maps grounding request failed');
  }

  return res.json();
}

export type MusicModel = 'lyria-3-clip-preview' | 'lyria-3-pro-preview';

export async function generateMusic(params: {
  prompt: string;
  model?: MusicModel;
  imageBase64?: string;
  mimeType?: string;
}): Promise<{
  audioBase64: string;
  mimeType: string;
  lyrics: string;
  model: string;
}> {
  const res = await fetch('/api/gemini/generate-music', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Music generation failed');
  }

  return res.json();
}

export async function createOrEditImage(params: {
  prompt: string;
  inputImageBase64?: string;
  inputMimeType?: string;
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  imageSize?: '512px' | '1K' | '2K';
}): Promise<{
  imageBase64: string;
  imageUrl: string | null;
  text: string;
}> {
  const res = await fetch('/api/gemini/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Image creation/editing failed');
  }

  return res.json();
}

export async function generateVideo(params: {
  prompt: string;
  imageBase64?: string;
  mimeType?: string;
  aspectRatio?: '16:9' | '9:16';
}): Promise<{ operationName: string }> {
  const res = await fetch('/api/gemini/video-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Video generation initiation failed');
  }

  return res.json();
}

export async function checkVideoStatus(operationName: string): Promise<{
  done: boolean;
  error?: any;
}> {
  const res = await fetch('/api/gemini/video-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Video status check failed');
  }

  return res.json();
}

export async function downloadVideoBlob(operationName: string): Promise<Blob> {
  const res = await fetch('/api/gemini/video-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Video download failed');
  }

  return res.blob();
}

export async function transcribeAudio(params: {
  audioBase64: string;
  mimeType?: string;
  prompt?: string;
}): Promise<{ transcript: string }> {
  const res = await fetch('/api/gemini/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Audio transcription failed');
  }

  return res.json();
}
