import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import * as fs from "fs";

export interface AnalysisResult {
  title: string;
  summary: string;
  hook: {
    description: string;
    duration: string;
    technique: string;
  };
  structure: {
    intro: string;
    body: string;
    outro: string;
    pacing: string;
  };
  visualStyle: {
    colorPalette: string;
    transitions: string;
    textOverlays: string;
    bRoll: string;
  };
  audio: {
    backgroundMusic: string;
    voiceover: string;
    soundEffects: string;
    tone: string;
  };
  cta: {
    type: string;
    placement: string;
    message: string;
  };
  engagement: {
    estimatedRetention: string;
    keyMoments: string[];
    improvements: string[];
  };
  tags: string[];
}

export interface FlowJson {
  videoTitle: string;
  platform: string;
  duration: string;
  segments: Array<{
    order: number;
    name: string;
    duration: string;
    visual: string;
    audio: string;
    text: string;
    transition: string;
  }>;
  productionNotes: {
    colorGrading: string;
    musicGenre: string;
    editingStyle: string;
    aspectRatio: string;
  };
  aiPrompts: {
    imageGeneration: string;
    voiceoverScript: string;
    musicMood: string;
  };
}

export async function analyzeVideo(
  filePath: string,
  mimeType: string
): Promise<{ analysis: AnalysisResult; flowText: string; flowJson: FlowJson }> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const videoData = fs.readFileSync(filePath);
  const base64Video = videoData.toString("base64");

  const videoPart: Part = {
    inlineData: {
      mimeType: mimeType as string,
      data: base64Video,
    },
  };

  // Analysis prompt
  const analysisPrompt = `Kamu adalah ahli analisis konten video shorts (TikTok/Instagram Reels/YouTube Shorts). 
Analisis video ini secara menyeluruh dan berikan respons dalam format JSON yang valid.

Berikan analisis dengan struktur JSON berikut (HANYA JSON, tanpa teks lain):
{
  "title": "Judul video berdasarkan konten",
  "summary": "Ringkasan singkat video dalam 2-3 kalimat",
  "hook": {
    "description": "Deskripsi hook di detik pertama",
    "duration": "Durasi hook (misal: 0-3 detik)",
    "technique": "Teknik hook yang digunakan (misal: pertanyaan, visual mengejutkan, dll)"
  },
  "structure": {
    "intro": "Bagaimana intro disusun",
    "body": "Konten utama video",
    "outro": "Bagaimana outro/penutup",
    "pacing": "Ritme editing (cepat/sedang/lambat)"
  },
  "visualStyle": {
    "colorPalette": "Palet warna dominan",
    "transitions": "Jenis transisi yang digunakan",
    "textOverlays": "Penggunaan teks di layar",
    "bRoll": "Penggunaan B-roll footage"
  },
  "audio": {
    "backgroundMusic": "Deskripsi musik latar",
    "voiceover": "Ada/tidak voiceover dan gayanya",
    "soundEffects": "Sound effects yang digunakan",
    "tone": "Tone keseluruhan audio"
  },
  "cta": {
    "type": "Jenis CTA (follow, like, komentar, dll)",
    "placement": "Dimana CTA ditempatkan",
    "message": "Pesan CTA yang disampaikan"
  },
  "engagement": {
    "estimatedRetention": "Perkiraan tingkat retensi penonton",
    "keyMoments": ["momen penting 1", "momen penting 2"],
    "improvements": ["saran perbaikan 1", "saran perbaikan 2"]
  },
  "tags": ["tag1", "tag2", "tag3"]
}`;

  const analysisResponse = await model.generateContent([
    videoPart,
    analysisPrompt,
  ]);
  const analysisText = analysisResponse.response.text().trim();

  // Clean the response to extract JSON
  let analysisJson: AnalysisResult;
  try {
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    analysisJson = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Failed to parse AI analysis response");
  }

  // Flow text prompt
  const flowTextPrompt = `Berdasarkan video ini, buatkan SKRIP PRODUKSI LENGKAP untuk mereplikasi atau membuat video serupa.
Format dalam bentuk teks yang detail dan terstruktur, mencakup:

1. KONSEP & ANGLE
2. SKRIP SHOT BY SHOT (dengan timing)
3. PANDUAN VISUAL (kamera, pencahayaan, latar)
4. PANDUAN AUDIO (musik, voiceover, SFX)
5. PANDUAN EDITING (transisi, efek, teks)
6. TIPS OPTIMASI (judul, hashtag, caption)

Tulis dalam Bahasa Indonesia yang jelas dan actionable. Minimal 500 kata.`;

  const flowTextResponse = await model.generateContent([
    videoPart,
    flowTextPrompt,
  ]);
  const flowText = flowTextResponse.response.text().trim();

  // Flow JSON prompt
  const flowJsonPrompt = `Berdasarkan video ini, buat video production flow dalam format JSON yang terstruktur.
Berikan HANYA JSON valid (tanpa teks lain) dengan struktur:
{
  "videoTitle": "Judul video yang direkomendasikan",
  "platform": "Platform target (TikTok/Instagram Reels/YouTube Shorts)",
  "duration": "Durasi total video",
  "segments": [
    {
      "order": 1,
      "name": "Nama segmen (misal: Hook)",
      "duration": "0-3 detik",
      "visual": "Deskripsi visual yang diperlukan",
      "audio": "Deskripsi audio yang diperlukan",
      "text": "Teks overlay jika ada",
      "transition": "Jenis transisi ke segmen berikutnya"
    }
  ],
  "productionNotes": {
    "colorGrading": "Panduan color grading",
    "musicGenre": "Genre musik yang cocok",
    "editingStyle": "Gaya editing",
    "aspectRatio": "Rasio aspek (9:16)"
  },
  "aiPrompts": {
    "imageGeneration": "Prompt untuk generate gambar/thumbnail dengan AI",
    "voiceoverScript": "Skrip lengkap untuk voiceover",
    "musicMood": "Deskripsi mood musik untuk AI musik generator"
  }
}`;

  const flowJsonResponse = await model.generateContent([
    videoPart,
    flowJsonPrompt,
  ]);
  const flowJsonText = flowJsonResponse.response.text().trim();

  let flowJsonParsed: FlowJson;
  try {
    const jsonMatch = flowJsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in flow response");
    flowJsonParsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Failed to parse AI flow JSON response");
  }

  return {
    analysis: analysisJson,
    flowText,
    flowJson: flowJsonParsed,
  };
}

// ─── Video Prompt Generator ────────────────────────────────────────────────────

export interface VideoPromptResult {
  text: string;
  json?: {
    sceneDescription: string;
    camera: { movement: string; angle: string; lens: string; depthOfField: string };
    lighting: { type: string; colorTemperature: string; shadows: string; source: string };
    subject: { description: string; action: string; expression?: string; clothing?: string };
    atmosphere: { mood: string; timeOfDay: string; weather: string; setting: string };
    colorGrade: { style: string; palette: string; contrast: string; reference: string };
    motion: { speed: string; dynamics: string; cameraMotion: string };
    technical: { duration: string; aspectRatio: string; resolution: string; fps: string };
    platformPrompts: {
      universal: string; veo31: string; googleFlow: string;
      grok: string; runway: string; kling: string;
    };
    negativePrompt: string;
    tags: string[];
  };
}

export async function generateVideoPrompt(
  filePath: string,
  mimeType: string,
  lang: "id" | "en",
  format: "text" | "json"
): Promise<VideoPromptResult> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString("base64");

  const mediaPart: Part = {
    inlineData: { mimeType: mimeType as string, data: base64Data },
  };

  const isId = lang === "id";
  const isImage = mimeType.startsWith("image/");
  const mediaType = isImage ? "image" : "video";

  // ── Text format prompt ──────────────────────────────────────────────────────
  const textPrompt = `You are a world-class AI video generation prompt engineer specializing in crafting hyper-detailed, cinematic prompts for AI video generators: Veo 3.1, Google Flow, Grok Aurora, Runway Gen-3, and Kling AI.

Analyze this ${mediaType} thoroughly. ${isId ? "Write the full response in Bahasa Indonesia, except the 6 platform prompts which MUST be in English." : "Write the full response in English."}

Output a structured prompt using these labeled sections. Be extremely descriptive and specific:

[DESKRIPSI SCENE]
Describe every visual element — environment, objects, subjects, background, foreground, spatial depth. What is happening? What is the context?

[KAMERA]
Camera movement (static / pan left-right / dolly in-out / crane / handheld / orbital / tracking shot), angle (eye-level / low / bird's-eye / over-shoulder / dutch tilt), lens (wide angle / telephoto / macro / anamorphic), depth of field (shallow bokeh / deep focus / rack focus).

[PENCAHAYAAN]
Lighting type (natural golden hour / blue hour / overcast / studio softbox / neon / candlelight / backlit / rim light), color temperature (warm 3200K / natural 5600K / cool 7000K), shadow quality, light source direction and intensity.

[SUBJEK]
Physical description, clothing with material/texture, facial expression, body language, specific action/movement, position and scale within frame.

[ATMOSFER]
Mood (dramatic / serene / mysterious / energetic / melancholic), time of day (golden sunrise / midday / dusk / twilight / night), weather (clear / overcast / rain / fog / snow), location ambiance.

[COLOR GRADE]
Grading style (cinematic teal-orange / warm vintage film / desaturated noir / vibrant pop / muted pastel / Kodachrome), dominant palette, contrast level, film/photographer reference.

[GERAK]
Motion speed (240fps slow-mo / 24fps cinematic / 60fps), dynamic elements (wind, water flow, smoke, particles, cloth physics), overall motion energy.

[TEKNIS]
Duration (3-5s / 6-8s / 10s), aspect ratio (9:16 / 16:9 / 1:1), resolution (1080p Full HD), frame rate.

[PLATFORM PROMPTS - ENGLISH]
Write optimized prompts for each platform:

• UNIVERSAL (all platforms):
[One dense paragraph combining all elements for maximum photorealism and quality]

• VEO 3.1 (Google DeepMind):
[Emphasize physical realism, material properties, temporal consistency, natural motion physics. Use rich descriptive language about materials and lighting interactions.]

• GOOGLE FLOW:
[Emphasize overall scene context, subject-background interaction, narrative flow, environmental storytelling.]

• GROK AURORA (xAI):
[Emphasize photorealistic rendering, physics accuracy, facial realism, natural motion fidelity, real-world material behavior.]

• RUNWAY GEN-3:
[Use motion descriptor language, specify element isolation if needed, reference cinematic films, describe motion paths explicitly.]

• KLING AI:
[Describe temporal flow, realistic physics-based motion, detail interaction between subject and environment, natural timing.]

[NEGATIVE PROMPT - ENGLISH]
List what to avoid: cartoonish, watermark, text overlay, distorted faces, blurry, artifacts, unnatural colors, CGI look, etc.

[TAGS]
8-10 descriptive tags.

Be professional-grade and cinematic in every section. The goal: the most photorealistic, natural-looking output possible.`;

  const textResponse = await model.generateContent([mediaPart, textPrompt]);
  const generatedText = textResponse.response.text().trim();

  if (format === "text") {
    return { text: generatedText };
  }

  // ── JSON format prompt ──────────────────────────────────────────────────────
  const jsonPrompt = `You are a world-class AI video generation prompt engineer.

Analyze this ${mediaType} and respond with ONLY valid JSON (no markdown, no explanation, no code fences).

${isId ? "Write descriptive fields in Bahasa Indonesia, EXCEPT all 6 platformPrompts values which MUST be in English." : "Write all values in English."}

Use this exact structure:
{
  "sceneDescription": "Extremely detailed description of everything visible — environment, subjects, objects, spatial depth, action happening",
  "camera": {
    "movement": "Precise camera movement (e.g., slow dolly-in, static, left-to-right pan)",
    "angle": "Camera angle and framing description",
    "lens": "Lens type and approximate focal length",
    "depthOfField": "DOF — shallow bokeh, deep focus, or rack focus details"
  },
  "lighting": {
    "type": "Specific lighting setup type",
    "colorTemperature": "Color temperature in Kelvin + description",
    "shadows": "Shadow quality, direction, softness",
    "source": "Light source description, position, intensity"
  },
  "subject": {
    "description": "Detailed physical description of main subject(s)",
    "action": "Specific action or movement of subject",
    "expression": "Facial expression or emotional state",
    "clothing": "Clothing details — material, color, texture, style"
  },
  "atmosphere": {
    "mood": "Emotional mood and psychological tone",
    "timeOfDay": "Specific time with light quality description",
    "weather": "Weather conditions and atmospheric effects",
    "setting": "Exact location and environment details"
  },
  "colorGrade": {
    "style": "Color grading style name",
    "palette": "Dominant 3-4 color palette description",
    "contrast": "Contrast level: low, medium, high, filmic",
    "reference": "Reference film, photographer, or aesthetic era"
  },
  "motion": {
    "speed": "Playback speed, fps, slow motion details",
    "dynamics": "Dynamic moving elements: wind, water, particles, cloth, hair",
    "cameraMotion": "Specific camera movement path and speed"
  },
  "technical": {
    "duration": "Recommended duration in seconds",
    "aspectRatio": "Aspect ratio e.g. 9:16, 16:9, 1:1",
    "resolution": "Target resolution (max 1080p Full HD)",
    "fps": "Frame rate for output"
  },
  "platformPrompts": {
    "universal": "ENGLISH: Single dense paragraph optimized for all platforms — maximum realism, cinematic quality, photorealistic output",
    "veo31": "ENGLISH: Veo 3.1 prompt — emphasize material physics, light interaction on surfaces, temporal consistency, micro-expressions, natural motion",
    "googleFlow": "ENGLISH: Google Flow prompt — emphasize full scene narrative, subject-background interaction, environmental storytelling, flow of motion",
    "grok": "ENGLISH: Grok Aurora prompt — emphasize photorealistic human/object rendering, physics accuracy, natural facial animation, real-world material behavior",
    "runway": "ENGLISH: Runway Gen-3 prompt — specify motion paths explicitly, use cinematic film references, describe camera motion direction clearly",
    "kling": "ENGLISH: Kling AI prompt — emphasize temporal motion flow, realistic physics interaction, natural timing, detailed subject-environment dynamics"
  },
  "negativePrompt": "cartoonish, animated, watermark, text overlay, distorted faces, blurry, motion artifacts, unnatural colors, CGI look, low quality, pixelated, overexposed, underexposed",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"]
}`;

  const jsonResponse = await model.generateContent([mediaPart, jsonPrompt]);
  const jsonText = jsonResponse.response.text().trim();

  let jsonParsed;
  try {
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    jsonParsed = JSON.parse(jsonMatch[0]);
  } catch {
    return { text: generatedText };
  }

  return { text: generatedText, json: jsonParsed };
}

