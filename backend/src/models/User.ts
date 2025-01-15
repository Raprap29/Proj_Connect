import { Schema, model, Document, Model } from 'mongoose';

interface IUser extends Document {
  name: string;
  age: number;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
}, {
  timestamps: true,
});

UserSchema.pre<IUser>('save', async function(next){
   
});

const UserModel: Model<IUser> = model<IUser>("User", UserSchema);

export default UserModel;
