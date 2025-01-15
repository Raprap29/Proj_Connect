import { Schema, model, Document, Model } from 'mongoose';

interface IEmployee extends Document {
  name: string;
  age: number;
  email: string;
  password: string;
}

const EmployeeSchema = new Schema<IEmployee>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
}, {
  timestamps: true,
});

EmployeeSchema.pre<IEmployee>('save', async function(next){
   
});

const EmployeeModel: Model<IEmployee> = model<IEmployee>("Employee", EmployeeSchema);

export default EmployeeModel;
