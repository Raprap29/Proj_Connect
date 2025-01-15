import { UnauthorizedError } from "@/utils/errors";
import { Context, Next } from "hono"
import { decode, sign, verify } from 'hono/jwt'

export const authenticationMiddleware = async (c: Context, next: Next) => {
    const accessToken = c.req.header('Authorization')?.split("Bearer ")[1];

    if(!accessToken){
        throw new UnauthorizedError("Access is token required");
    }

    const secretKey = "Iloveyou";

    const decodedPayload = await verify(accessToken, secretKey)

    if(!decodedPayload){
        throw new UnauthorizedError("Unauthorized pages");
    }

    await next();
}