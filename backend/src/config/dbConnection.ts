import dotenv from 'dotenv';
import mongoose from 'mongoose';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const MIGRATE_MONGO_URI = process.env.MIGRATE_MONGO_URI;

if (!MIGRATE_MONGO_URI) {
    throw new Error('MIGRATE_MONGO_URI environment variable is missing!');
}

export const dbConnect = mongoose.connect(MIGRATE_MONGO_URI);