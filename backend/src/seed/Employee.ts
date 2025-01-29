import EmployeeModel from "../models/Employee"
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import bcrypt from "bcryptjs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// Access environment variables
const MIGRATE_MONGO_URI = process.env.MIGRATE_MONGO_URI;

if (!MIGRATE_MONGO_URI) {
throw new Error('MIGRATE_MONGO_URI environment variable is missing!');
}

// Connect to MongoDB
mongoose.connect(MIGRATE_MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const seederEmployee = async () => {
  const Employee: any = [];
  const salt = 12;
  const passwordHash = await bcrypt.hash('12345', salt);
  Array.from({ length: 10 }, () => {
    Employee.push({ firstName: faker.internet.username(), lastName: faker.internet.username(), username: faker.internet.username(), role: 1, password: passwordHash })
  })

  try{
    await EmployeeModel.deleteMany({});
    const createdData =  await EmployeeModel.insertMany(Employee);
    if(createdData){
      console.log("Success seeder");
    }
  }catch(e){
    return console.error(e);
  } finally {
    process.exit(); 
  }
}

seederEmployee();

