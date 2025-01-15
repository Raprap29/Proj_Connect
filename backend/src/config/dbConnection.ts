import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables based on the current environment
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const MIGRATE_MONGO_URI = process.env.MIGRATE_MONGO_URI;

if (!MIGRATE_MONGO_URI) {
    throw new Error('MIGRATE_MONGO_URI environment variable is missing!');
}

// Define a function to connect to the database
const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(MIGRATE_MONGO_URI);
        console.log('Successfully connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectToDatabase;

// Invoke the connection function
connectToDatabase();
