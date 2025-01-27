import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import dotenv from "dotenv";
import * as fs from 'fs';
import { v4 } from "uuid";
dotenv.config();

class AiServices {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = "AIzaSyB6n997Kw-AipDq06T_2Be2OtfOIiGPCIQ";
    if (!apiKey) {
      throw new Error("API key is missing. Please set it in your environment variables.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async AiChat(message: string, modelName: string): Promise<any> {
    try {
      const model: GenerativeModel = this.genAI.getGenerativeModel({ model: modelName });

      const response = await model.generateContent(message);

      return response.response;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }

  async ImageChat(message: string, modelName: string, uploadedFile: File): Promise<any> {
    try{
        const model: GenerativeModel = this.genAI.getGenerativeModel({ model: modelName });
        const mimeType = uploadedFile.type || "image/png";
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const fileExtension = mimeType.split('/')[1];
        fs.writeFileSync(`public/uploads/${v4()}.${fileExtension}`, Buffer.from(arrayBuffer));
        return true;

        // const base64Image = Buffer.from(arrayBuffer).toString('base64');
        // const base32Encoded = `data:${mimeType};base64,${base64Image}`;

        // const result = await model.generateContent([message, base32Encoded]);

        // return result.response;

    }catch(e)
    {
        throw e;
    }
    

  }
}

export default new AiServices();
