import { Hono } from "hono";

import { GET_MESSAGES, GET_USERSONLINE, STOP_TICKET, UPDATE_UNREAD } from ".";

import { authenticationMiddleware } from "@/middleware/authentication";

const router = new Hono()
    .get('/getmessage/:userId', authenticationMiddleware ,GET_MESSAGES)
    .delete('/stop-ticket/:userId', authenticationMiddleware, STOP_TICKET)
    .get('/online/users', authenticationMiddleware, GET_USERSONLINE)
    .post('/update-unread/:userId', authenticationMiddleware, UPDATE_UNREAD);

export default router;