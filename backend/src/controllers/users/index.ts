import { NotFoundError, RequiredError } from "@/utils/errors";
import { Context } from "hono";
import userService from "@/services/userService";
export const getUsers = async (c: Context) => {
    const {page} = c.req.param();

    const pageNumber = page as number | undefined;

    if(!pageNumber){
        throw new RequiredError("Input pages number");
    }

    const response = await userService.getAllUsers(pageNumber);

    return c.json(response, 200);
}

export const Register = async (c:Context) => {
    const body = await c.req.json();

    if(!body.username || !body.password || !body.firstName || !body.lastName)
    {
        throw new RequiredError("* Please fill all the field.")
    }

    const success = await userService.createUser(body.firstName, body.lastName, body.username, body.password, 0);

    if(success){
        return c.json({message: "Success created users", status: true}, 200);
    }
}

export const Login = async (c:Context) => {
    const body = await c.req.json();

    if(!body.username || !body.password) throw new RequiredError("* Required username and password");

    const response = await userService.Login(body.username, body.password);

    return c.json({token: response.token, id: response.id, username: response.username}, 200);
}

export const GetUser = async (c:Context) => {
    const {id} = c.req.param();

    if(!id)
    {
        throw new NotFoundError("Missing ID"); 
    }
    const userProfile = await userService.getUserById(id);

    return c.json({user: userProfile}, 200);

}

export const DeleteUser = async (c: Context) => {
    const {id} = c.req.param();

    if(!id){
        throw new NotFoundError("Missing ID");
    }

    const successDelete = await userService.deleteUser(id);

    if(successDelete){
        return c.json({message: "Successfully deleted"}, 200);
    }
}

export const UpdateUser = async (c: Context) => {
    const { id } = c.req.param();

    if(!id){
        throw new NotFoundError("No id found");
    }

    const { firstName, lastName, username, password } = await c.req.json(); 

    const successUpdate = await userService.updateUser(id, firstName, lastName, username, password);

    if(successUpdate){
        return c.json({message: "Success Update"}, 200);
    }

}