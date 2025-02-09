import messageService from "@/services/messageService";
import { NotFoundError, RequiredError } from "@/utils/errors";
import { Context } from "hono";


export const GET_MESSAGES = async (c: Context) => {
    const {userId} = c.req.param();

    if(!userId){
        throw new RequiredError("Please input field");
    }

    const getMessages = await messageService.getAllMessages(userId);

    return c.json({data: getMessages}, 200);
}

export const STOP_TICKET = async (c: Context) => {
    const {userId} = c.req.param();

    if(!userId){
        throw new RequiredError("Input params");
    }

    const success = await messageService.STOP_TICKETS(userId);

    return c.json({data: success}, 200);

}

export const GET_USERSONLINE =  async (c: Context) => {

    const search = c.req.query('q');

    const searchQuery = search as string | undefined;

    const response = await messageService.GET_USERSONLINE(searchQuery);

    return c.json({users: response.users}, 200);
}

export const UPDATE_UNREAD = async (c: Context) => {
    const {userId} = c.req.param();

    if(!userId){
        throw new RequiredError("Please field user ID");
    }

    const success= await messageService.UpdateUnread(userId);

    if(success){
        return c.json({status: true}, 200)
    }

}