import MessageCheckModel from "@/models/MessageCheck";
import MessageModel from "@/models/Message";
import { NotFoundError } from "@/utils/errors";
import UserModel from "@/models/User";

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

interface MessageCount {
    userId: string;
    message: string;
    read: boolean;
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

    async UpdateUnread (userId: string): Promise<boolean> {

        const GetMessageCheck = await MessageCheckModel.findOne({userId: userId, status: 0}).lean();

        await MessageModel.updateMany(
            { ticketId: GetMessageCheck?.ticketId, read: false }, // Find unread messages
            { $set: { read: true } } // Mark as read
        );  
        
        return true;

    }

    async STOP_TICKETS (userId: string) {
        const GetMessageCheck = await MessageCheckModel.findOne({userId: userId, status: 0});

        if(!GetMessageCheck){
            throw new NotFoundError("No Message Status");
        }

        GetMessageCheck.status = 1;
        const success = await GetMessageCheck.save();

        return success;

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

    async GET_USERSONLINE (searchQuery: string | undefined) {

  
        const searchCondition = {
          $or: [
            { username: { $regex: searchQuery, $options: 'i' } },
            { firstName: { $regex: searchQuery, $options: 'i' } },
            { lastName: { $regex: searchQuery, $options: 'i' } },
            { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] },
             regex: searchQuery, options: 'i' } } }
          ],
        };
    
        const totalUsers = await UserModel.countDocuments(searchCondition);
    

        const users = await UserModel.find(searchCondition);

        const userIds = users.map(user => user._id);
        const checkMessage = await MessageCheckModel.find(
            { userId: { $in: userIds }, status: 0 }, 
        )

        // Check user Id
        const checkedUserIds = checkMessage.map(msg => msg.userId.toString());
        const usersWithMessages  = await MessageModel.find(
            { userId: { $in: checkedUserIds} }, 
        ).lean();

        const StoreMessage = new Map<string, MessageCount[]>();

        usersWithMessages.forEach(item => {
            if (!StoreMessage.has(item.userId)) {
                // Initialize with an array containing the first message
                StoreMessage.set(item.userId, [{
                    userId: item.userId,
                    message: item.message,
                    read: item.read,
                    ticketId: item.ticketId,
                    status: item.status,
                }]);
            } else {
                // Push new message to the existing array
                StoreMessage.get(item.userId)?.push({
                    userId: item.userId,
                    message: item.message,
                    read: item.read,
                    ticketId: item.ticketId,
                    status: item.status,
                });
            }
        });

        const usersWithMessageData = users.map(user => ({
            user,
            messages: StoreMessage.get(user._id.toString()) || [],
        }));

        return { users: usersWithMessageData };
    }

}

export default new MessageService();