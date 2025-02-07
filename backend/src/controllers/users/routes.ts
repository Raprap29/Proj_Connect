import { Hono } from "hono";

import { CheckStatusTickets, DeleteUser, GetUser, getUsers, Login, Register, UpdateUser } from ".";

import { authenticationMiddleware } from "@/middleware/authentication";

const router = new Hono()
    .get('/users/:page', authenticationMiddleware, getUsers)
    .post('/register', Register)
    .post('/login', Login)
    .get("/user/:id", GetUser)
    .delete('/user/delete/:id', authenticationMiddleware, DeleteUser)
    .put('/user/update/:id', authenticationMiddleware, UpdateUser)
    .get('/ticket', authenticationMiddleware, CheckStatusTickets);

export default router;