import { GoogleGenerativeAI } from '@google/generative-ai';
import { Request, Response, NextFunction } from 'express';
import { productTools } from '@/services/gemini.tools'; // -> 1. Impor tools Anda
import productService from '@/services/product.service'; // -> 2. Impor service yang akan dijalankan
import { systemInstruction } from '@/helpers/instruction.helper';
import stockService from '@/services/stock.service';
// import stockService from '@/services/stock.service'; // (Contoh jika Anda punya service stok)

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || 'MASUKKAN_API_KEY_ANDA_DI_SINI';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// -> 3. Inisialisasi model dengan tools yang tersedia
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  tools: productTools,
  systemInstruction: systemInstruction,
});

interface StockReportArgs {
  productIdentifier: string;
}

class GeminiController {
  public async chat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { message, history = [] } = req.body;

      const chat = model.startChat({ history });

      // -> 4. Kirim pesan pengguna ke Gemini
      const result = await chat.sendMessage(message);
      const call = result.response.functionCalls()?.[0];

      // -> 5. Jika Gemini tidak meminta memanggil fungsi, langsung kembalikan jawaban
      if (!call) {
        res.json({
          reply: result.response.text(),
          history: await chat.getHistory(),
        });
        return;
      }

      console.log(
        'AI wants to call function:',
        call.name,
        'with args:',
        call.args
      );

      // -> 6. Jalankan fungsi yang sesuai berdasarkan permintaan AI
      let functionResponse;

      switch (call.name) {
        case 'find_products': {
          const products = await productService.findAll(call.args);
          functionResponse = { products };
          break;
        }

        case 'get_stock_report_by_product': {
          // -> FIX: Gunakan type assertion di sini
          const { productIdentifier } = call.args as StockReportArgs;
          const report = await stockService.findStockReport(productIdentifier);
          functionResponse = { report };
          break;
        }

        case 'create_product': {
          // Dapatkan userId dari middleware auth Anda, AI tidak menangani otentikasi
          const createdById = (req as any).user.id; // Sesuaikan dengan implementasi auth Anda
          const newProduct = await productService.create(
            call.args as any,
            createdById
          );
          functionResponse = { product: newProduct };
          break;
        }

        default:
          throw new Error(`Fungsi yang diminta AI tidak dikenal: ${call.name}`);
      }

      // -> 7. Kirim hasil eksekusi fungsi kembali ke AI untuk diolah menjadi bahasa manusia
      const finalResult = await chat.sendMessage([
        {
          functionResponse: {
            name: call.name,
            response: functionResponse,
          },
        },
      ]);

      // -> 8. Kembalikan respons akhir dari AI dan history baru ke client
      res.json({
        reply: finalResult.response.text(),
        history: await chat.getHistory(),
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GeminiController();
