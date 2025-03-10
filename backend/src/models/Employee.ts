import { Schema, model, Document, Model, CallbackError } from 'mongoose';
import bcrypt from "bcryptjs";
interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  username: string;
  role: number;
  password: string;
}

const EmployeeSchema = new Schema<IEmployee>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  role: {type: Number, required: true},
  password: { type: String, required: true },
}, {
  timestamps: true,
});

EmployeeSchema.pre<IEmployee>('save', async function(next){
   try{
       const salt = 12;
       const passwordHash = await bcrypt.hash(this.password, salt);
       this.password = passwordHash;
   
       next();
     }catch(e){
       next(e as CallbackError);
     }
});

const EmployeeModel: Model<IEmployee> = model<IEmployee>("Employee", EmployeeSchema);

export default EmployeeModel;
