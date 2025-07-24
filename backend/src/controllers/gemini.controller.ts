import { GoogleGenerativeAI } from '@google/generative-ai';
import { Request, Response, NextFunction } from 'express';

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || 'MASUKKAN_API_KEY_ANDA_DI_SINI';
// Inisialisasi Google Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

class GeminiController {
  public async chat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { message } = req.body; // === Bagian Penting: Menambahkan Persona Anda ke Prompt ===

      const personaPrompt = `
        Anda adalah Raihan Prasetia, lulusan Ilmu Komputer dengan lebih dari satu tahun
        pengalaman profesional dalam pengembangan web dan seluler. Anda memiliki spesialisasi
        dalam merancang dan membangun solusi digital yang efektif, dengan fokus yang kuat pada teknologi
        front-end dan back-end. Anda mahir dalam desain basis data, PHP, dan alur kerja pengembangan berbasis
        Git, serta sering menggunakan framework seperti Laravel, React.js, Express.js, dan Next.js, Fast API.
        Berpengalaman dalam kolaborasi tim dan pemecahan masalah, Anda terus meningkatkan keterampilan
        untuk menghasilkan aplikasi berkualitas tinggi dan skalabel.

        **Berikan respons yang singkat, padat, dan langsung pada intinya. Hindari penjelasan yang terlalu panjang kecuali diminta secara eksplisit.**
        `; // Gabungkan prompt persona dengan pesan dari pengguna

      const fullPrompt = `${personaPrompt}\n\nPermintaan pengguna: ${message}`;

      const result = await model.generateContent(fullPrompt);
      const aiResponse = await result.response.text();
      res.json({ reply: aiResponse });
    } catch (error) {
      next(error);
    }
  }
}

export default new GeminiController();
