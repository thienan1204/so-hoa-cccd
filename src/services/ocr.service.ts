import { Injectable } from '@angular/core';
import { OcrResult, ExtractedData } from '../ocr-data.model';
// Uncomment the lines below to integrate with Google Gemini API
// import { GoogleGenAI, Type } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class OcrService {

  // --- GEMINI API INTEGRATION (EXAMPLE) ---
  // To enable real OCR, uncomment the following lines and provide your API key.
  // The API key should be managed securely, e.g., via environment variables.
  /*
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn('API_KEY for Gemini is not configured. OCR service will run in simulation mode.');
    }
  }
  */

  /**
   * Processes an image and extracts information using OCR.
   * This is currently a simulation.
   * @param base64Image The base64 encoded string of the image.
   * @returns A promise that resolves with the OCR result.
   */
  async extractDataFromImage(base64Image: string): Promise<OcrResult> {
    // If real Gemini API is configured, use it. Otherwise, fall back to simulation.
    /*
    if (this.ai) {
      return this.performRealOcr(base64Image);
    } else {
      return this.simulateOcr();
    }
    */
    return this.simulateOcr();
  }
  
  private simulateOcr(): Promise<OcrResult> {
    console.log('Simulating OCR processing...');
    return new Promise(resolve => {
      setTimeout(() => {
        const mockResult: OcrResult = {
          rawText: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
Số: 012345678912
Họ và tên: LÊ VĂN ANH
Ngày, tháng, năm sinh: 01/01/1990
Giới tính: Nam   Quốc tịch: Việt Nam
Quê quán: Xã A, Huyện B, Tỉnh C
Nơi thường trú: 123 Đường D, Phường E, Quận F, Thành phố Hà Nội
Có giá trị đến: 01/01/2030
Ngày cấp: 15/09/2020`,
          extractedData: {
            hoTen: 'LÊ VĂN ANH',
            soCCCD: '012345678912',
            ngayCap: '09/15/2020',
            diaChi: '123 Đường D, Phường E, Quận F, Thành phố Hà Nội',
          },
        };
        console.log('Simulation complete.');
        resolve(mockResult);
      }, 1500); // Simulate network delay
    });
  }

  /**
   * --- FOR ACTUAL GEMINI API IMPLEMENTATION ---
   * This function shows how you would call the Gemini API for OCR.
   */
  /*
  private async performRealOcr(base64Image: string): Promise<OcrResult> {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized.');
    }

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg', // Or 'image/png'
      },
    };

    const textPart = {
      text: `Từ hình ảnh giấy tờ tùy thân này, hãy trích xuất các thông tin sau và trả về dưới dạng JSON:
      1. Họ và tên (hoTen)
      2. Số Căn cước công dân (soCCCD)
      3. Ngày cấp (ngayCap) theo định dạng MM/DD/YYYY
      4. Địa chỉ thường trú (diaChi)
      Đồng thời, trả về toàn bộ văn bản nhận dạng được dưới dạng một chuỗi duy nhất.`,
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        rawText: { type: Type.STRING, description: 'Toàn bộ văn bản nhận dạng được từ ảnh.' },
        extractedData: {
          type: Type.OBJECT,
          properties: {
            hoTen: { type: Type.STRING },
            soCCCD: { type: Type.STRING },
            ngayCap: { type: Type.STRING },
            diaChi: { type: Type.STRING },
          },
        },
      },
    };

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    return JSON.parse(response.text) as OcrResult;
  }
  */
}
