import { Hono } from "hono";

import { GET_MESSAGES } from ".";

import { authenticationMiddleware } from "@/middleware/authentication";

const router = new Hono()
    .get('/getmessage/:userId', authenticationMiddleware ,GET_MESSAGES);

export default router;