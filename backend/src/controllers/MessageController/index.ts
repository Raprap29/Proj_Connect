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