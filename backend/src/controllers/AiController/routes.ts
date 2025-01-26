import { Hono } from "hono";

import { MessageAiController, MessageAiImageController } from ".";

import { authenticationMiddleware } from "@/middleware/authentication";

const router = new Hono()
    .post('/ai/message', MessageAiController)
    .post('/ai/image', MessageAiImageController)
    

export default router;