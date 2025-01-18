import { Hono } from "hono";

import { DeleteUser, GetUser, getUsers, Login, Register, UpdateUser } from ".";

import { authenticationMiddleware } from "@/middleware/authentication";

const router = new Hono()
    .get('/users', authenticationMiddleware , getUsers)
    .post('/register', Register)
    .post('/login', Login)
    .get("/user/:id", GetUser)
    .delete('/user/delete/:id', authenticationMiddleware ,DeleteUser)
    .put('/user/update/:id', authenticationMiddleware, UpdateUser);

export default router;