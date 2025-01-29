import EmployeeModel from "../models/Employee"
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

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
    
    const Employee = [
        { firstName: "test", lastName: "test", username: "test", role: "test", password: "test" }
    ]

    try{
        const createdData =  await EmployeeModel.insertMany(Employee);
        console.log("Success seeder");
    }catch(e){
        return console.error(e);
    } finally {
        process.exit(); 
    }
}

seederEmployee();

