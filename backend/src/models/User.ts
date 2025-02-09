import { Schema, model, Document, Model, CallbackError } from 'mongoose';
import bcrypt from "bcryptjs";
interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: number;
  password: string;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {type: Number, required: true},
  username: { type: String, required: true },
  password: { type: String, required: true },
}, {
  timestamps: true,
});

UserSchema.pre<IUser>('save', async function(next){
  try{
    const salt = 12;
    const passwordHash = await bcrypt.hash(this.password, salt);
    this.password = passwordHash;

    next();
  }catch(e){
    next(e as CallbackError);
  }
});

const UserModel: Model<IUser> = model<IUser>("User", UserSchema);

export default UserModel;
