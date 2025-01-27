import { NotFoundError, RequiredError } from "@/utils/errors";
import { Context } from "hono";
import aiServices from "@/services/aiServices";

export const MessageAiController = async (c: Context) => {

    const body = await c.req.json();

    try{
        const response = await aiServices.AiChat(body.message, "gemini-pro");

        return c.json({message: response.text()}, 200);

    }catch(e){
        throw new Error("Error");
    }
}


export const MessageAiImageController = async (c: Context) => {
  try {
    // Parse the form data from the request
    const formData = await c.req.parseBody();

    const uploadedFile = formData['image'] as File;

    if (!uploadedFile) {
      return c.json({ message: 'No file uploaded. Please include an image.' }, 400);
    }

    const message = formData['message'] as string;

    if(!message){
      throw new RequiredError("Please enter message");
    }

    const response = await aiServices.ImageChat(message, 'gemini-1.5-flash', uploadedFile);

    return c.json({message: response.text()}, 200);

  } catch (error) {
    console.error('Error processing file upload:', error);
    return c.json({ message: 'An error occurred while processing the file upload.' }, 500);
  }
};
