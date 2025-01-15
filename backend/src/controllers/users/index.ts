import { NotFoundError, RequiredError } from "@/utils/errors";
import { Context } from "hono";
import userService from "@/services/userService";
export const getUsers = async (c: Context) => {

    const users = await userService.getAllUsers();

    return c.json({data: users}, 200);
}

export const Register = async (c:Context) => {
    const body = await c.req.json();

    if(!body.username || !body.password || !body.firstName || !body.lastName)
    {
        throw new RequiredError("* Please fill all the field.")
    }

    const success = await userService.createUser(body.firstName, body.lastName, body.username, body.password);

    if(success){
        return c.json({message: success}, 200);
    }
}

export const Login = async (c:Context) => {
    const body = await c.req.json();

    if(!body.username || !body.password) throw new RequiredError("* Required username and password");

    const token = await userService.Login(body.username, body.password);

    return c.json({data: token}, 200);
}