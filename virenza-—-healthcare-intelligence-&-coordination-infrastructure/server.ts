import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer } from 'ws';
import { GoogleGenAI, Modality, GenerateVideosOperation, LiveServerMessage } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required for Gemini AI features. Please configure it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const server = http.createServer(app);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // 1. Gemini Chatbot (Multi-turn, role-based, model selector)
  // Supported models per instructions: gemini-3.1-pro-preview (complex), gemini-3.5-flash (general), gemini-3.1-flash-lite (fast)
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { messages, systemInstruction, model = 'gemini-3.5-flash' } = req.body;
      const ai = getAi();

      const validModels = ['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
      const chosenModel = validModels.includes(model) ? model : 'gemini-3.5-flash';

      // Format contents for generateContent
      const contents = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: chosenModel,
        contents,
        config: {
          systemInstruction: systemInstruction || 'You are VIRENZA AI, an advanced clinical and healthcare intelligence assistant.',
        },
      });

      res.json({
        text: response.text || '',
        model: chosenModel,
      });
    } catch (err: any) {
      console.error('Gemini Chat error:', err);
      res.status(500).json({ error: err.message || 'Failed to generate chat response' });
    }
  });

  // 2. Google Search Grounding with gemini-3.5-flash
  app.post('/api/gemini/search-grounding', async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const ai = getAi();

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || 'You are an up-to-date healthcare and clinical research intelligence assistant. Provide verified information using web search.',
          tools: [{ googleSearch: {} }],
        },
      });

      // Extract search grounding metadata if available
      const candidate = response.candidates?.[0];
      const searchChunks = candidate?.groundingMetadata?.groundingChunks || [];
      const webSources = searchChunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({
          title: c.web?.title || 'Web Reference',
          url: c.web?.uri,
        }));

      res.json({
        text: response.text || '',
        sources: webSources,
        metadata: candidate?.groundingMetadata || null,
      });
    } catch (err: any) {
      console.error('Search grounding error:', err);
      res.status(500).json({ error: err.message || 'Failed to search grounded data' });
    }
  });

  // 3. Google Maps Grounding with gemini-3.5-flash
  app.post('/api/gemini/maps-grounding', async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const ai = getAi();

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || 'You are a healthcare logistics & facilities guide. Use Google Maps grounding to locate hospitals, trauma centers, specialty clinics, pharmacies, and emergency services.',
          tools: [{ googleMaps: {} }],
        },
      });

      const candidate = response.candidates?.[0];
      const mapChunks = candidate?.groundingMetadata?.groundingChunks || [];

      res.json({
        text: response.text || '',
        places: mapChunks,
        metadata: candidate?.groundingMetadata || null,
      });
    } catch (err: any) {
      console.error('Maps grounding error:', err);
      res.status(500).json({ error: err.message || 'Failed to get maps grounded data' });
    }
  });

  // 4. Music Generation with lyria-3-clip-preview (up to 30s) or lyria-3-pro-preview (full tracks)
  app.post('/api/gemini/generate-music', async (req, res) => {
    try {
      const { prompt, model = 'lyria-3-clip-preview', imageBase64, mimeType: imageMime } = req.body;
      const ai = getAi();

      const chosenModel = model === 'lyria-3-pro-preview' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

      let contents: any = prompt;
      if (imageBase64) {
        contents = {
          parts: [
            { text: prompt || 'Generate a therapeutic healing track inspired by this image.' },
            { inlineData: { data: imageBase64, mimeType: imageMime || 'image/jpeg' } },
          ],
        };
      }

      const response = await ai.models.generateContentStream({
        model: chosenModel,
        contents,
        config: {
          responseModalities: [Modality.AUDIO],
        },
      });

      let audioBase64 = '';
      let lyrics = '';
      let audioMimeType = 'audio/wav';

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;

        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              audioMimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics = part.text;
          }
        }
      }

      res.json({
        audioBase64,
        mimeType: audioMimeType,
        lyrics,
        model: chosenModel,
      });
    } catch (err: any) {
      console.error('Lyria Music error:', err);
      res.status(500).json({ error: err.message || 'Failed to generate music track' });
    }
  });

  // 5. Create & Edit Images using gemini-3.1-flash-image-preview
  app.post('/api/gemini/image', async (req, res) => {
    try {
      const { prompt, inputImageBase64, inputMimeType = 'image/png', aspectRatio = '1:1', imageSize = '1K' } = req.body;
      const ai = getAi();

      let parts: any[] = [];
      if (inputImageBase64) {
        // Image editing mode
        parts.push({
          inlineData: {
            data: inputImageBase64,
            mimeType: inputMimeType,
          },
        });
        parts.push({
          text: prompt || 'Modify and enhance this clinical illustration according to instructions.',
        });
      } else {
        // Image creation mode
        parts.push({
          text: prompt || 'Medical illustration of human cardiac anatomical structures with clear vascular labels, high definition, clean background.',
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || '1:1',
            imageSize: imageSize || '1K',
          },
        },
      });

      let resultImageBase64 = '';
      let textOutput = '';

      const responseParts = response.candidates?.[0]?.content?.parts || [];
      for (const part of responseParts) {
        if (part.inlineData?.data) {
          resultImageBase64 = part.inlineData.data;
        } else if (part.text) {
          textOutput += part.text;
        }
      }

      if (!resultImageBase64 && !textOutput) {
        throw new Error('No image or text returned by model');
      }

      res.json({
        imageBase64: resultImageBase64,
        imageUrl: resultImageBase64 ? `data:image/png;base64,${resultImageBase64}` : null,
        text: textOutput,
      });
    } catch (err: any) {
      console.error('Image creation/edit error:', err);
      res.status(500).json({ error: err.message || 'Failed to create or edit image' });
    }
  });

  // 6. Veo Video Generation: veo-3.1-fast-generate-preview
  // Supports Text-to-Video and Photo-to-Video animation with aspect ratio 16:9 or 9:16
  app.post('/api/gemini/video-generate', async (req, res) => {
    try {
      const { prompt, imageBase64, mimeType = 'image/png', aspectRatio = '16:9' } = req.body;
      const ai = getAi();

      const validAspect = aspectRatio === '9:16' ? '9:16' : '16:9';

      let operation: any;
      if (imageBase64) {
        // Animate photo into video
        operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: prompt || 'Subtle cinematic clinical animation of physiological process',
          image: {
            imageBytes: imageBase64,
            mimeType: mimeType || 'image/png',
          },
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: validAspect,
          },
        });
      } else {
        // Text-to-video
        operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: prompt || '3D visualization of blood flow through a coronary artery, cinematic, 4k detail',
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: validAspect,
          },
        });
      }

      res.json({ operationName: operation.name });
    } catch (err: any) {
      console.error('Veo video generate error:', err);
      res.status(500).json({ error: err.message || 'Failed to start video generation' });
    }
  });

  app.post('/api/gemini/video-status', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName required' });
      }
      const ai = getAi();
      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });

      res.json({
        done: Boolean(updated.done),
        error: updated.error || null,
      });
    } catch (err: any) {
      console.error('Veo status error:', err);
      res.status(500).json({ error: err.message || 'Failed to check video status' });
    }
  });

  app.post('/api/gemini/video-download', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName required' });
      }
      const ai = getAi();
      const apiKey = process.env.GEMINI_API_KEY;
      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });

      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        return res.status(404).json({ error: 'Video URI not available yet' });
      }

      const videoRes = await fetch(uri, {
        headers: { 'x-goog-api-key': apiKey || '' },
      });

      if (!videoRes.ok) {
        throw new Error(`Failed to fetch video: ${videoRes.statusText}`);
      }

      res.setHeader('Content-Type', 'video/mp4');
      const arrayBuffer = await videoRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error('Veo download error:', err);
      res.status(500).json({ error: err.message || 'Failed to download video' });
    }
  });

  // 7. Audio Transcription with gemini-3.5-transcribe
  app.post('/api/gemini/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/webm', prompt = 'Transcribe this clinical consultation audio accurately with medical terminology.' } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: 'audioBase64 is required' });
      }
      const ai = getAi();

      const audioPart = {
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: audioBase64,
        },
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [audioPart, { text: prompt }],
        },
      });

      res.json({
        transcript: response.text || '',
      });
    } catch (err: any) {
      console.error('Transcription error:', err);
      res.status(500).json({ error: err.message || 'Failed to transcribe audio' });
    }
  });

  // 8. WebSocket for Live Voice Conversations (gemini-3.1-flash-live-preview)
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
    if (pathname === '/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', async (clientWs) => {
    console.log('[Live API] Client connected to voice session');
    let session: any = null;

    try {
      const ai = getAi();
      session = await ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are VIRENZA Live Voice Assistant. You provide real-time, compassionate, clear voice medical and health coordination guidance.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onclose: () => {
            console.log('[Live API] Session closed');
          },
          onerror: (err) => {
            console.error('[Live API] Session error:', err);
            if (clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ error: err.message || 'Live session error' }));
            }
          },
        },
      });
    } catch (err: any) {
      console.error('[Live API] Failed to connect session:', err);
      if (clientWs.readyState === clientWs.OPEN) {
        clientWs.send(JSON.stringify({ error: err.message || 'Failed to initialize live voice session' }));
      }
      return;
    }

    clientWs.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.audio && session) {
          session.sendRealtimeInput({
            audio: { data: msg.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.error('[Live API] Error handling client message:', err);
      }
    });

    clientWs.on('close', () => {
      if (session) {
        try {
          session.close();
        } catch {}
      }
    });
  });

  // Vite middleware in dev; static file serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`VIRENZA Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
