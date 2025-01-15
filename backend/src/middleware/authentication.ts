import { UnauthorizedError } from "@/utils/errors";
import { Context, Next } from "hono"

export const authenticationMiddleware = async (c: Context, next: Next) => {
    const accessToken = c.req.header('Authorization')?.split("Bearer ")[1];

    if(!accessToken){
        throw new UnauthorizedError("Access is token required");
    }

    await next();
}