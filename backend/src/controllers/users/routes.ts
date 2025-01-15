import { Hono } from "hono";

import { getUsers, Login, Register } from ".";

import { authenticationMiddleware } from "@/middleware/authentication";

const router = new Hono()
    .get('/users', authenticationMiddleware , getUsers)
    .post('/register', Register)
    .post('/login', Login);

export default router;