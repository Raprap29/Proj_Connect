import { Schema, model, Document, Model } from 'mongoose';

interface IMessage extends Document {
  userId: string;
  message: string;
  ticketId: string;
  status: number;
}

const MessageSchema = new Schema<IMessage>({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  ticketId: { type: String, require: true },
  status: { type: Number, required: true },
}, {
  timestamps: true,
});

MessageSchema.pre<IMessage>('save', async function(next){
   
});

const MessageModel: Model<IMessage> = model<IMessage>("Message", MessageSchema);

export default MessageModel;
