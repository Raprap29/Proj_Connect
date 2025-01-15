import { Hono } from "hono";

import { getUserController } from ".";

import { authenticationMiddleware } from "@/middleware/authentication";

const router = new Hono()
    .post('/users', authenticationMiddleware ,getUserController);

export default router;