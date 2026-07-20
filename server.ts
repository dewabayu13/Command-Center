/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Access API Key from server environment variables
const apiKey = process.env.GEMINI_API_KEY;

// Create shared Gemini client utility
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// REST API endpoint for the Smart AI Village Assistant Chatbot
app.post('/api/ai-assistant', async (req, res) => {
  const { message, contextData, history } = req.body;

  if (!apiKey || !ai) {
    // If the API key is not set, we'll provide a high-quality simulated response 
    // to keep the app working gracefully, but alert the system.
    console.warn('GEMINI_API_KEY is not configured in the environment.');
    const simulatedReplies = [
      `Halo! Saya Desi, Asisten Pintar Bongas Kulon. Saat ini kunci API Gemini belum terkonfigurasi di panel Secrets. Namun, berdasarkan data desa:\n\n- **Jumlah Penduduk:** ${contextData?.citizensCount || 24} Jiwa\n- **Serapan APBDes:** Rp 2,1M (${contextData?.budget?.absorptionRate || '87.5'}%)\n- **Pencapaian Pajak PBB:** ${contextData?.taxRate || 78}%\n\nAda yang bisa saya bantu dengan simulasi data ini?`,
      `Tentu, saya dapat mensimulasikan draf surat atau analisis untuk Anda. Berdasarkan database Desa Bongas Kulon, anggaran belanja tahun 2026 berfokus pada infrastruktur fisik dan jaminan sosial warga prasejahtera. Mohon pasang **GEMINI_API_KEY** di pengaturan agar saya dapat berpikir secara dinamis!`,
      `Sebagai asisten desa, saya sarankan untuk meninjau status keluhan masuk (${contextData?.complaintsCount || 3} keluhan tertunda). Mayoritas keluhan berkaitan dengan lubang jalan dan penerangan RT di Blok Selasa.`
    ];
    const reply = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];
    return res.json({ reply, isMock: true });
  }

  try {
    // Grounding Context injection for Gemini
    const systemPrompt = `
You are "Desi", the AI Village Assistant for the "EasyDes Smart Village Command Center" in Desa Bongas Kulon, Kecamatan Sumberjaya, Kabupaten Majalengka, Jawa Barat.
Your role is to assist village officials (Kepala Desa, Sekretaris, Bendahara, Operators) and citizens with natural language queries, report generation, and drafting official documents.

Desa Bongas Kulon Profile:
- Kecamatan: Sumberjaya, Kabupaten: Majalengka, Provinsi: Jawa Barat.
- Dusun/Blok: Blok Sabtu (dusun_01), Blok Selasa (dusun_02), Blok Rabu (dusun_03), Blok Karang Kencana (dusun_04).

Current Live Database Statistics to ground your response:
- Population: ${contextData?.citizensCount || 24} citizens registered in the database, with ${contextData?.poorCount || 10} classified as poor/underprivileged KK (Keluarga Prasejahtera).
- APBDes Budget: Revenue Rp ${contextData?.budget?.revenue?.total?.toLocaleString('id-ID') || '2.450.000.000'}, Expenditure Rp ${contextData?.budget?.expenditure?.total?.toLocaleString('id-ID') || '2.140.000.000'}, Absorption ${contextData?.budget?.absorptionRate || 87}%. Budget allocations: Govt Bongas Kulon Rp 410 Juta, Infrastruktur Rp 495 Juta, Social Welfare Rp 135 Juta, Empowerment Rp 110 Juta, Disaster Res. Rp 60 Juta.
- Tax PBB: Achievement rate is ${contextData?.taxRate || 83}%. Paid tax Rp ${contextData?.taxPaidAmount?.toLocaleString('id-ID') || '125.000.000'} of total target Rp ${contextData?.taxTotalAmount?.toLocaleString('id-ID') || '150.000.000'}. Best collector hamlet is Blok Sabtu.
- Letters: Total ${contextData?.lettersCount || 12} letters in queue. Average completion time is 12 minutes.
- Complaints: Total ${contextData?.complaintsCount || 4} active citizen reports in the queue (including "Lubang Besar di Jembatan Krajan Kidul", "Pohon Tumbang Blok Sabtu").
- Assets: Total registered village assets include Land (Tanah Kas Desa Blok Sabtu), Buildings (Balai Desa, Gedung PAUD), Vehicles (Ambulans Desa), and Equipment.

GUIDELINES:
1. Always write in Indonesian (Bahasa Indonesia). Be polite, expert, professional, and clear.
2. If asked to generate reports, use Markdown tables, lists, and bold headers to make it look premium.
3. If asked to draft letters (such as SKU, SKTM, Domisili), output a beautifully structured letter format complete with Letterhead (KOP SURAT PEMERINTAH DESA BONGAS KULON, KECAMATAN SUMBERJAYA, KABUPATEN MAJALENGKA), fields for Name/NIK/Details, and a Digital Signature (Tanda Tangan Elektronik QR) block.
4. If asked about the budget, provide smart insights or suggestions on where the remaining fund should be prioritized (e.g. disaster mitigation, community empowerment, infrastructure).
5. Ground your answers ONLY in the real Indonesian village context of Bongas Kulon and the provided statistics. Do not hallucinate external details.
6. Support Voice Command Ready styling by answering directly and clearly, as if spoken aloud.
`;

    // Map conversation history
    const chatHistory = history?.map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    })) || [];

    // Query Gemini 3.5 Flash Model
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const reply = response.text || "Maaf, saya tidak dapat merumuskan tanggapan saat ini.";
    res.json({ reply, isMock: false });
  } catch (err: any) {
    console.error('Gemini API Integration Error:', err);
    res.status(500).json({ error: err.message || 'Error occurred while contacting Gemini API.' });
  }
});

// Configure Vite middleware or Static files asset pipeline
const initServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted for development.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Static build directory mounted for production.');
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Village Command Center Server listening on http://0.0.0.0:${PORT}`);
  });
};

initServer().catch((error) => {
  console.error('Failed to initialize server:', error);
});
