import { Hono } from "hono";

import { GetUser, getUsers, Login, Register } from ".";

import { authenticationMiddleware } from "@/middleware/authentication";

const router = new Hono()
    .get('/users', authenticationMiddleware , getUsers)
    .post('/register', Register)
    .post('/login', Login)
    .get("/user/:id", GetUser);

export default router;