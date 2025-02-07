import mongoose, { Schema, model, Document, Model, CallbackError } from 'mongoose';

interface IMessageCheck extends Document {
  userId: string;
  ticketId: string;
  status: number;
}

const MessageCheckSchema = new Schema<IMessageCheck>({
  userId: { type: String, required: true },
  ticketId: { type: String },
  status: { type: Number, required: true },
}, {
  timestamps: true,
});

const generateTicket = (): string => {
  const randomSegment = Math.random().toString(36).substring(2, 6).toUpperCase();
  const randomSegment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${randomSegment}-${randomSegment2}`;
}

MessageCheckSchema.pre<IMessageCheck>('save', async function(next){
    try{
  
      if(!this.ticketId){
        let unique = false;
        let newTicket = "";

        while(!unique){
          newTicket = generateTicket();
          const existTicket = await mongoose.models.Messagecheck?.findOne({ticketId: newTicket});
          if(!existTicket) unique = true;
        }

        this.ticketId = newTicket;
      }
   
       next();
     }catch(e){
       next(e as CallbackError);
     }
});

const MessageCheckModel: Model<IMessageCheck> = model<IMessageCheck>("Messagecheck", MessageCheckSchema);

export default MessageCheckModel;
