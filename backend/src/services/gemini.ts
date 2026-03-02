import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import * as fs from "fs";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ViralAnalysis {
  title: string;
  summary: string;
  viralScore: {
    overall: number; hook: number; retention: number;
    shareability: number; emotionalImpact: number;
  };
  viralFormula: string;
  contentDNA: {
    triggerEmotion: string; curiosityGap: string;
    relatabilityFactor: string; noveltyElement: string; socialCurrency: string;
  };
  hook: { seconds: string; type: string; technique: string; whyItWorks: string; };
  retentionMechanics: { openLoop: string; peakMoment: string; replayFactor: string; };
  atmFramework: { amati: string[]; tiru: string[]; modifikasi: string[]; };
  contentIdeas: Array<{ angle: string; hook: string; twist: string; }>;
  productionRecipe: {
    visualStyle: string; editingPace: string; audioStrategy: string;
    captionStrategy: string; duration: string; bestPlatform: string;
  };
  distribution: { bestPostingTime: string; hashtagStrategy: string; captionFormula: string; };
  tags: string[];
}

export interface ContentScript {
  variation: number;
  angle: string;
  estimatedDuration: string;
  hook: { text: string; duration: string; visualGuide: string; technique: string; };
  body: Array<{ timestamp: string; narration: string; visualGuide: string; editingNote: string; }>;
  cta: { text: string; timestamp: string; visualGuide: string; };
  productionNotes: { totalDuration: string; editingSoftware: string; audioRecommendation: string; };
}

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

// ─── Analyze Video ─────────────────────────────────────────────────────────────

export async function analyzeVideo(
  filePath: string,
  mimeType: string
): Promise<{ analysis: ViralAnalysis; flowText: string; flowJson: object }> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const videoData = fs.readFileSync(filePath);
  const base64Video = videoData.toString("base64");

  const videoPart: Part = { inlineData: { mimeType: mimeType as string, data: base64Video } };

  const prompt = `Kamu adalah pakar strategi konten viral kelas dunia. Tugasmu adalah membedah video ini untuk mengungkap FORMULA SUKSES mengapa video tersebut berpotensi viral.

Analisis mendalam dan berikan respons HANYA dalam format JSON valid (tanpa markdown fences, tanpa teks lain di luar JSON):

{
  "title": "Judul deskriptif video berdasarkan kontennya",
  "summary": "Ringkasan 2-3 kalimat tentang konten video ini",
  "viralScore": {
    "overall": <angka 1-10 float, potensi viral keseluruhan>,
    "hook": <angka 1-10, kekuatan hook detik pertama>,
    "retention": <angka 1-10, kemampuan menahan penonton hingga akhir>,
    "shareability": <angka 1-10, seberapa besar orang ingin share>,
    "emotionalImpact": <angka 1-10, dampak emosional pada penonton>
  },
  "viralFormula": "Penjelasan 2-3 paragraf mendalam: MENGAPA video ini bisa viral? Apa kombinasi faktor psikologis, teknis, dan konten yang membuatnya berhasil? Ini adalah insight paling berharga dari analisis.",
  "contentDNA": {
    "triggerEmotion": "Emosi utama yang dipicu dan mengapa emosi ini mendorong sharing",
    "curiosityGap": "Bagaimana video menciptakan rasa penasaran yang membuat penonton tidak bisa berhenti menonton",
    "relatabilityFactor": "Apa elemen yang membuat penonton merasa terhubung secara personal",
    "noveltyElement": "Apa yang unik atau belum pernah dilihat sebelumnya di video ini",
    "socialCurrency": "Mengapa orang mau share video ini"
  },
  "hook": {
    "seconds": "Durasi hook (misal: 0-3 detik)",
    "type": "Tipe hook (visual shock / pertanyaan / pernyataan kontroversial / humor / dll)",
    "technique": "Teknik hook spesifik yang digunakan",
    "whyItWorks": "Penjelasan mengapa hook ini efektif secara psikologis"
  },
  "retentionMechanics": {
    "openLoop": "Bagaimana video membuka loop penasaran di awal dan kapan ditutup",
    "peakMoment": "Momen puncak atau payoff yang membuat penonton terpuaskan",
    "replayFactor": "Mengapa penonton mau menonton ulang video ini"
  },
  "atmFramework": {
    "amati": [
      "Elemen spesifik #1 yang harus dicatat: [nama elemen] — [kenapa ini kunci sukses]",
      "Elemen spesifik #2 yang harus dicatat: [nama elemen] — [kenapa ini kunci sukses]",
      "Elemen spesifik #3 yang harus dicatat: [nama elemen] — [kenapa ini kunci sukses]",
      "Elemen spesifik #4 yang harus dicatat: [nama elemen] — [kenapa ini kunci sukses]"
    ],
    "tiru": [
      "Langkah tiruan #1: [apa yang harus direplikasi] — [cara melakukannya]",
      "Langkah tiruan #2: [apa yang harus direplikasi] — [cara melakukannya]",
      "Langkah tiruan #3: [apa yang harus direplikasi] — [cara melakukannya]",
      "Langkah tiruan #4: [apa yang harus direplikasi] — [cara melakukannya]"
    ],
    "modifikasi": [
      "Ide modifikasi #1: [twist kreatif] — ubah [X] menjadi [Y] untuk niche [Z]",
      "Ide modifikasi #2: [twist kreatif] — ubah [X] menjadi [Y] untuk niche [Z]",
      "Ide modifikasi #3: [twist kreatif] — ubah [X] menjadi [Y] untuk niche [Z]",
      "Ide modifikasi #4: [twist kreatif] — ubah [X] menjadi [Y] untuk niche [Z]"
    ]
  },
  "contentIdeas": [
    { "angle": "Angle konten baru", "hook": "Hook spesifik", "twist": "Elemen beda/unik" },
    { "angle": "Angle konten baru kedua", "hook": "Hook spesifik kedua", "twist": "Twist unik kedua" },
    { "angle": "Angle konten baru ketiga", "hook": "Hook spesifik ketiga", "twist": "Twist unik ketiga" }
  ],
  "productionRecipe": {
    "visualStyle": "Gaya visual spesifik: pencahayaan, komposisi, estetika",
    "editingPace": "Ritme dan teknik editing: kecepatan cut, transisi, pacing",
    "audioStrategy": "Strategi audio: pilihan musik, soundbite, sound effect",
    "captionStrategy": "Strategi caption/teks di video: ukuran, warna, timing, gaya",
    "duration": "Durasi optimal dan mengapa durasi ini bekerja",
    "bestPlatform": "Platform terbaik untuk konten jenis ini dan alasannya"
  },
  "distribution": {
    "bestPostingTime": "Waktu posting terbaik untuk platform target",
    "hashtagStrategy": "Strategi hashtag: kombinasi besar-sedang-niche yang direkomendasikan",
    "captionFormula": "Formula caption yang cocok untuk memaksimalkan engagement"
  },
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"]
}

PENTING: Berikan analisis yang JUJUR, MENDALAM, dan ACTIONABLE. Jangan generik.`;

  const response = await model.generateContent([videoPart, prompt]);
  const responseText = response.response.text().trim();

  let analysisJson: ViralAnalysis;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    analysisJson = JSON.parse(jsonMatch[0]);
  } catch (err) {
    throw new Error(`Failed to parse AI response: ${err instanceof Error ? err.message : String(err)}`);
  }

  return {
    analysis: analysisJson,
    flowText: analysisJson.viralFormula || "",
    flowJson: {
      contentIdeas: analysisJson.contentIdeas,
      productionRecipe: analysisJson.productionRecipe,
      atmFramework: analysisJson.atmFramework,
    },
  };
}

// ─── Generate ATM Bridge Scripts ───────────────────────────────────────────────

export async function generateContentScripts(
  analysis: ViralAnalysis,
  niche: string
): Promise<ContentScript[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `Kamu adalah script writer video shorts kelas dunia yang ahli dalam membuat konten viral untuk TikTok, Reels, dan YouTube Shorts.

Berdasarkan analisis video viral berikut, buat 3 variasi script video shorts yang menggunakan formula yang sama namun diadaptasi untuk NICHE: "${niche}"

ANALISIS VIDEO VIRAL YANG JADI REFERENSI:
- Formula Viral: ${analysis.viralFormula}
- Hook Type: ${analysis.hook?.type} | Technique: ${analysis.hook?.technique}
- Hook Timing: ${analysis.hook?.seconds}
- Retention: Open Loop: ${analysis.retentionMechanics?.openLoop}
- Peak Moment: ${analysis.retentionMechanics?.peakMoment}
- ATM Amati: ${(analysis.atmFramework?.amati || []).join(" | ")}
- ATM Tiru: ${(analysis.atmFramework?.tiru || []).join(" | ")}
- Production: ${analysis.productionRecipe?.editingPace} | ${analysis.productionRecipe?.visualStyle}
- Durasi: ${analysis.productionRecipe?.duration}
- Trigger Emosi: ${analysis.contentDNA?.triggerEmotion}

Berikan respons HANYA dalam format JSON valid (tanpa markdown fences):

[
  {
    "variation": 1,
    "angle": "Nama angle/pendekatan unik untuk variasi ini",
    "estimatedDuration": "Estimasi durasi total",
    "hook": {
      "text": "Script hook word-for-word (0-3 detik pertama). Harus langsung menarik.",
      "duration": "0-3s",
      "visualGuide": "Panduan visual: apa yang terlihat di layar saat hook diucapkan",
      "technique": "Nama teknik hook yang digunakan"
    },
    "body": [
      {
        "timestamp": "3-10s",
        "narration": "Script narasi/dialog word-for-word",
        "visualGuide": "Panduan visual: shot, angle, aksi yang terlihat",
        "editingNote": "Catatan editing: cut style, transisi, text overlay"
      },
      {
        "timestamp": "10-25s",
        "narration": "Lanjutan narasi",
        "visualGuide": "Visual guide lanjutan",
        "editingNote": "Editing note lanjutan"
      },
      {
        "timestamp": "25-35s",
        "narration": "Menuju CTA",
        "visualGuide": "Visual guide",
        "editingNote": "Editing note"
      }
    ],
    "cta": {
      "text": "CTA word-for-word yang natural",
      "timestamp": "35-45s",
      "visualGuide": "Visual guide untuk CTA"
    },
    "productionNotes": {
      "totalDuration": "45 detik",
      "editingSoftware": "CapCut / Premiere Pro",
      "audioRecommendation": "Rekomendasi musik/audio"
    }
  }
]

Buat 3 variasi dengan angle yang berbeda-beda. Hook harus dalam 0-3 detik pertama dan langsung menarik!`;

  const response = await model.generateContent(prompt);
  const responseText = response.response.text().trim();

  try {
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found");
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    throw new Error(`Failed to parse scripts: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ─── Generate Trending Script ──────────────────────────────────────────────────

export async function generateTrendingScript(
  trendingAnalysis: any,
  trendingTitle: string,
  niche: string,
  userTopic: string | null,
  tones: string[]
): Promise<ContentScript[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const toneMap: Record<string, string> = {
    Seru: "energetik, hype, penuh semangat dan excitement",
    Informatif: "edukatif, kredibel, memberikan value dan insight yang jelas",
    Komedi: "lucu, relatable, ringan dan menghibur dengan humor yang natural",
    Motivatif: "inspiratif, membakar semangat, memberikan dorongan emosional yang kuat",
    Edukatif: "mendalam, step-by-step, memberikan pengetahuan praktis yang bisa langsung diaplikasikan",
    Storytelling: "naratif, emosional, menggunakan struktur cerita yang menarik dan personal",
  };
  const toneDesc = tones.map((t) => toneMap[t] || t).join(" + ");

  const analysisContext = `
TRENDING VIDEO REFERENCE (${niche} niche):
- Judul: ${trendingTitle}
- Hook Formula: ${trendingAnalysis.hook?.type || "Pattern Interrupt"} | Teknik: ${trendingAnalysis.hook?.technique || "Visual shock opening"}
- Hook Timing: ${trendingAnalysis.hook?.seconds || "0-3 detik pertama"}
- Viral Formula: ${trendingAnalysis.viralFormula || "Hook > Build-up > Payoff > CTA"}
- Retention: Open Loop: ${trendingAnalysis.retentionMechanics?.openLoop || "Buka pertanyaan di detik pertama"}
- Peak Moment: ${trendingAnalysis.retentionMechanics?.peakMoment || "Reveal di tengah video"}
- ATM Amati: ${(trendingAnalysis.atmFramework?.amati || []).join(" | ")}
- ATM Tiru: ${(trendingAnalysis.atmFramework?.tiru || []).join(" | ")}
- Production Recipe: ${trendingAnalysis.productionRecipe?.editingPace || "Fast cuts"} | ${trendingAnalysis.productionRecipe?.visualStyle || "Dynamic"} | ${trendingAnalysis.productionRecipe?.audioStrategy || "Trending audio"}
- Durasi Optimal: ${trendingAnalysis.productionRecipe?.duration || "30-60 detik"}
- Platform: ${trendingAnalysis.productionRecipe?.bestPlatform || "TikTok/Reels/Shorts"}
- Trigger Emosi: ${trendingAnalysis.contentDNA?.triggerEmotion || "FOMO + Curiosity"}
`;

  const prompt = `Kamu adalah script writer video shorts kelas dunia yang ahli meniru formula viral dan mengadaptasinya ke berbagai topik.

TRENDING FORMULA YANG SEDANG VIRAL:
${analysisContext}

${userTopic ? `TOPIK USER: "${userTopic}"` : `TOPIK USER: (tidak ditentukan — pilihkan topik terbaik yang relevan dengan niche ${niche} dan sedang ramai di platform shorts saat ini)`}
NICHE: ${niche}
TONE YANG DIINGINKAN: ${toneDesc}

TUGAS: Buat 3 variasi script video shorts (TikTok/Reels/YouTube Shorts) yang:
1. STRUKTUR HOOK-nya 100% mengikuti formula trending di atas
2. PACING dan TEKNIK RETENTION-nya sama persis
3. ISI dan KONTEKS disesuaikan dengan topik (jika ada) atau topik terbaik untuk niche tersebut
4. Tone harus TERASA: ${toneDesc}
5. Setiap variasi punya ANGLE yang berbeda-beda namun menggunakan DNA yang sama

PENTING: Ini untuk SHORT VIDEO, durasi sekitar ${trendingAnalysis.productionRecipe?.duration || "30-60 detik"}. 
Hook harus langsung menarik dalam 0-3 detik pertama!

Berikan respons HANYA dalam format JSON valid (tanpa markdown fences):

[
  {
    "variation": 1,
    "angle": "Nama angle/pendekatan unik untuk variasi ini",
    "estimatedDuration": "Estimasi durasi total",
    "hook": {
      "text": "Script hook word-for-word (0-3 detik pertama). Harus langsung menarik.",
      "duration": "0-3s",
      "visualGuide": "Panduan visual: apa yang terlihat di layar saat hook diucapkan",
      "technique": "Nama teknik hook yang digunakan"
    },
    "body": [
      {
        "timestamp": "3-10s",
        "narration": "Script narasi/dialog word-for-word",
        "visualGuide": "Panduan visual: shot, angle, aksi yang terlihat",
        "editingNote": "Catatan editing: cut style, transisi, text overlay"
      },
      {
        "timestamp": "10-25s",
        "narration": "Lanjutan narasi",
        "visualGuide": "Visual guide lanjutan",
        "editingNote": "Editing note lanjutan"
      }
    ],
    "cta": {
      "text": "CTA word-for-word yang natural",
      "timestamp": "25-35s",
      "visualGuide": "Visual guide untuk CTA"
    },
    "productionNotes": {
      "totalDuration": "35 detik",
      "editingSoftware": "CapCut / Premiere Pro",
      "audioRecommendation": "Rekomendasi musik/audio yang sesuai tone"
    }
  }
]

Buat 3 variasi dengan angle berbeda. Script harus siap produksi, natural, dan sesuai tone!`;

  const response = await model.generateContent(prompt);
  const responseText = response.response.text().trim();

  try {
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found");
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    throw new Error(`Failed to parse trending scripts: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ─── Video Prompt Generator ────────────────────────────────────────────────────

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
  const mediaPart: Part = { inlineData: { mimeType: mimeType as string, data: base64Data } };

  const isId = lang === "id";
  const isImage = mimeType.startsWith("image/");
  const mediaType = isImage ? "image" : "video";

  const textPrompt = `You are a world-class AI video generation prompt engineer specializing in crafting hyper-detailed, cinematic prompts for AI video generators: Veo 3.1, Google Flow, Grok Aurora, Runway Gen-3, and Kling AI.

Analyze this ${mediaType} thoroughly. ${isId ? "Write the full response in Bahasa Indonesia, except the 6 platform prompts which MUST be in English." : "Write the full response in English."}

Output a structured prompt using these labeled sections. Be extremely descriptive and specific:

[DESKRIPSI SCENE]
Describe every visual element — environment, objects, subjects, background, foreground, spatial depth.

[KAMERA]
Camera movement, angle, lens, depth of field.

[PENCAHAYAAN]
Lighting type, color temperature, shadow quality, light source.

[SUBJEK]
Physical description, clothing, facial expression, body language, specific action.

[ATMOSFER]
Mood, time of day, weather, location ambiance.

[COLOR GRADE]
Grading style, dominant palette, contrast level, film reference.

[GERAK]
Motion speed, dynamic elements, overall motion energy.

[TEKNIS]
Duration, aspect ratio, resolution, frame rate.

[PLATFORM PROMPTS - ENGLISH]
• UNIVERSAL (all platforms): [One dense paragraph]
• VEO 3.1 (Google DeepMind): [Emphasize physical realism]
• GOOGLE FLOW: [Emphasize scene context]
• GROK AURORA (xAI): [Emphasize photorealistic rendering]
• RUNWAY GEN-3: [Use motion descriptor language]
• KLING AI: [Describe temporal flow]

[NEGATIVE PROMPT - ENGLISH]
List what to avoid.

[TAGS]
8-10 descriptive tags.`;

  const textResponse = await model.generateContent([mediaPart, textPrompt]);
  const generatedText = textResponse.response.text().trim();

  if (format === "text") return { text: generatedText };

  const jsonPrompt = `You are a world-class AI video generation prompt engineer.

Analyze this ${mediaType} and respond with ONLY valid JSON (no markdown, no explanation, no code fences).

${isId ? "Write descriptive fields in Bahasa Indonesia, EXCEPT all 6 platformPrompts values which MUST be in English." : "Write all values in English."}

{
  "sceneDescription": "Extremely detailed description of everything visible",
  "camera": { "movement": "", "angle": "", "lens": "", "depthOfField": "" },
  "lighting": { "type": "", "colorTemperature": "", "shadows": "", "source": "" },
  "subject": { "description": "", "action": "", "expression": "", "clothing": "" },
  "atmosphere": { "mood": "", "timeOfDay": "", "weather": "", "setting": "" },
  "colorGrade": { "style": "", "palette": "", "contrast": "", "reference": "" },
  "motion": { "speed": "", "dynamics": "", "cameraMotion": "" },
  "technical": { "duration": "", "aspectRatio": "", "resolution": "", "fps": "" },
  "platformPrompts": {
    "universal": "ENGLISH: Single dense paragraph",
    "veo31": "ENGLISH: Veo 3.1 optimized",
    "googleFlow": "ENGLISH: Google Flow optimized",
    "grok": "ENGLISH: Grok Aurora optimized",
    "runway": "ENGLISH: Runway Gen-3 optimized",
    "kling": "ENGLISH: Kling AI optimized"
  },
  "negativePrompt": "cartoonish, watermark, text overlay, distorted faces, blurry, artifacts",
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
