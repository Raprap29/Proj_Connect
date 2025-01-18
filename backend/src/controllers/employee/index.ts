import { NotFoundError, RequiredError } from "@/utils/errors";
import { Context } from "hono";

export const getEmployee = (c: Context) => {
    return c.json({message: "test"}, 200);   
}