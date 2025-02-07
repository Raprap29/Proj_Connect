import MessageCheckModel from "@/models/MessageCheck";
import MessageModel from "@/models/Message";
import { NotFoundError } from "@/utils/errors";

interface MessagesProps {
    userId: string;
    message: string;
    status: number;
}

interface Messages {
    userId: string;
    message: string;
    ticketId: string;
    status: number;
}

class MessageService {
    async getAllMessages (userId: string): Promise<Messages[]> {
        try{
            const GetMessageCheck = await MessageCheckModel.findOne({userId: userId, status: 0}).lean();

            const getMessages = await MessageModel.find({ticketId: GetMessageCheck?.ticketId}).lean();

            if(!getMessages){
                throw new NotFoundError("No message");
            }

            return getMessages;

        }catch(error)
        {
            throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
        }
    }

    async STOP_TICKETS (userId: string) {
        const GetMessageCheck = await MessageCheckModel.findOne({userId: userId, status: 0});



    }

    async ADD_MESSAGES (data: MessagesProps) {
        let isNotAlreadyFinish

        isNotAlreadyFinish = await MessageCheckModel.findOne({
          userId: data.userId,
          status: 0
        });
      
        if (!isNotAlreadyFinish) {
          isNotAlreadyFinish = await MessageCheckModel.create({
            userId: data.userId,
            status: 0,
          });
        }
      
  
        const AddMessage = await MessageModel.create({
          userId: data.userId,
          message: data.message,
          ticketId: isNotAlreadyFinish.ticketId,
          status: data.status, 
        });

        return AddMessage;
    }

}

export default new MessageService();