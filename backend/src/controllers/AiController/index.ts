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

export const MessageAiImageController = async(c: Context) => {
    const body = await c.req.json();
    const contentType = c.req.header('content-type');
    
    const formData = await c.req.parseBody(); // Now parseBody is defined by the middleware

    const uploadedFile = formData['file'] as File | undefined;
  
    if(!body.message){
        throw new RequiredError("Please input fiead");
    }

    if(!contentType || !contentType.includes('multipart/formdata')){
        throw new RequiredError("Invalid content type. Please upload file");
    }

    if (!uploadedFile) {
      return c.text('No file uploaded!', 400);
    }
    
    const response = await aiServices.ImageChat(body.message, "gemini-pro-vision", uploadedFile)

    return c.json({message: response.text()}, 200);
}