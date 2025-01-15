import { NotFoundError, RequiredError } from "@/utils/errors";
import { Context } from "hono";
export const getUserController = async (c: Context) => {

    const body = await c.req.json();

    return c.json({message: body.name}, 200);
}

export const Login = async (c:Context) => {
    const body = await c.req.json();

    if(body.username || body.password) throw new RequiredError("* Required username and password");

        

}