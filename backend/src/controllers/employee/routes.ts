import { Hono } from "hono";

import { authenticationMiddleware } from "@/middleware/authentication";

import { getEmployee } from ".";

const router = new Hono()
    .get("/employees", getEmployee);
   

export default router;