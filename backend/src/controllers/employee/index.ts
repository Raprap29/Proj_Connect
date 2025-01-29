import { NotFoundError, RequiredError } from "@/utils/errors";
import { Context } from "hono";
import employeeService from "@/services/employeeService";
export const getUsers = async (c: Context) => {
    const {page} = c.req.param();

    const pageNumber = page as number | undefined;

    if(!pageNumber){
        throw new RequiredError("Please input page");
    }

    const response = await employeeService.getAllUsers(pageNumber);

    return c.json(response, 200);
}

export const Register = async (c:Context) => {
    const body = await c.req.json();

    if(!body.username || !body.password || !body.firstName || !body.lastName)
    {
        throw new RequiredError("* Please fill all the field.")
    }

    const success = await employeeService.createUser(body.firstName, body.lastName, body.username, body.password, 1);

    if(success){
        return c.json({message: success}, 200);
    }
}

export const Login = async (c:Context) => {
    const body = await c.req.json();

    if(!body.username || !body.password) throw new RequiredError("* Required username and password");

    const response = await employeeService.Login(body.username, body.password);

    return c.json({token: response.token, id: response.id, username: response.username}, 200);
}

export const GetUser = async (c:Context) => {
    const {id} = c.req.param();

    if(!id)
    {
        throw new NotFoundError("Missing ID"); 
    }
    const userProfile = await employeeService.getUserById(id);

    return c.json({user: userProfile}, 200);

}

export const DeleteUser = async (c: Context) => {
    const {id} = c.req.param();

    if(!id){
        throw new NotFoundError("Missing ID");
    }

    const successDelete = await employeeService.deleteUser(id);

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

    const successUpdate = await employeeService.updateUser(id, firstName, lastName, username, password);

    if(successUpdate){
        return c.json({message: "Success Update"}, 200);
    }

}