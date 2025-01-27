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

    // Retrieve the uploaded file (assumes 'image' is the field name in the form)
    const uploadedFile = formData['image'] as File;

    if (!uploadedFile) {
      return c.json({ message: 'No file uploaded. Please include an image.' }, 400);
    }

    if (!(uploadedFile instanceof File)) {
      return c.json({ message: 'Invalid file format.' }, 400);
    }

    const response = await aiServices.ImageChat('test', 'gemini-pro', uploadedFile);

    // Respond with success and file details
    if(response){
        return c.json(
            {
              message: formData['message'],
              fileName: uploadedFile.name,
              fileSize: uploadedFile.size,
              fileType: uploadedFile.type,
            },
            200
        );
    }
  } catch (error) {
    console.error('Error processing file upload:', error);
    return c.json({ message: 'An error occurred while processing the file upload.' }, 500);
  }
};
