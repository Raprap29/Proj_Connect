import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { exec } from "child_process";


// Load environment variables
dotenv.config();

// Determine the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const __dirname = path.dirname(new URL(import.meta.url).pathname); // ES Module workaround

// Retrieve migration path from environment variables
const PATH_MIGRATE = process.env.MIGRATE_TEMPLATE_SEED;

if (!PATH_MIGRATE) {
  throw new Error("MIGRATE_TEMPLATE_SEED is missing");
}

const migrationsDir = path.join(__dirname, PATH_MIGRATE);

// Retrieve MongoDB URI from environment variables
const MIGRATE_MONGO_URI = process.env.MIGRATE_MONGO_URI;
if (!MIGRATE_MONGO_URI) {
  throw new Error('MIGRATE_MONGO_URI environment variable is missing!');
}

// Connect to MongoDB
mongoose.connect(MIGRATE_MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Run migrations function
const runMigrations = async () => {
  try {
    // Read the migration files from the migrations directory
    const migrationFiles = fs.readdirSync(migrationsDir);

    // Filter out only JavaScript or TypeScript files (depending on your environment)
    const migrationScripts = migrationFiles.filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    // Loop through each migration script
    for (const migrationFile of migrationScripts) {
      const filePath = path.join(migrationsDir, migrationFile);
      console.log(`Running migration: ${filePath}`);
      
      // Use exec to run each migration file as a separate Node.js process
      await new Promise<void>((resolve, reject) => {
        exec(`tsx ${filePath}`, (err, stdout, stderr) => {
          if (err) {
            console.error(`Error executing migration file ${migrationFile}:`, stderr);
            return reject(err);
          }
          console.log(`Output of ${migrationFile}: ${stdout}`);
          resolve();
        });
      });
    }

    console.log('All migrations executed successfully');
    mongoose.connection.close();
  } catch (e) {
    console.error('Error during migration execution:', e);
  }
};

// Call the function to run migrations
runMigrations();
