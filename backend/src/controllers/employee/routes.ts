import { Hono } from "hono";

import { DeleteUser, GetUser, getUsers, Login, Register, UpdateUser } from ".";

import { authenticationMiddleware } from "@/middleware/authentication";

const router = new Hono()
    .get('/employees/:page', authenticationMiddleware, getUsers)
    .post('/register/employees', Register)
    .post('/login/employees', Login)
    .get("/employee/:id", GetUser)
    .delete('/employee/delete/:id', authenticationMiddleware ,DeleteUser)
    .put('/employee/update/:id', authenticationMiddleware, UpdateUser);

export default router;