import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Determine the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const __dirname = path.dirname(new URL(import.meta.url).pathname); // ES Module workaround

// Retrieve migration path from environment variables
const PATH_MIGRATE = process.env.MIGRATE_MIGRATIONS_PATH;

if (!PATH_MIGRATE) {
  throw new Error("MIGRATE_MIGRATIONS_PATH is missing");
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

// Get the action from command line arguments (either 'up' or 'down')
const action = process.argv[2]; // 'up' or 'down'

const runMigrations = async () => {
  try {
    // Read all migration files
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.ts')) // Filter for .ts files
      .sort(); // Sort files alphabetically to run migrations in order

    // Loop through each file and run the appropriate method
    for (const file of files) {
      const migrationPath = path.join(migrationsDir, file);
      const migration = await import(migrationPath); // Dynamically import the migration file

      if (action === 'up' && migration.up) {
        await migration.up(); // Apply the migration using 'up' method
        console.log(`Migration applied: ${file}`);
      } else if (action === 'down' && migration.down) {
        await migration.down(); // Rollback the migration using 'down' method
        console.log(`Migration rolled back: ${file}`);
      } else {
        console.error(`Migration file is missing '${action}' method: ${file}`);
      }
    }

    console.log(`${action === 'up' ? 'All migrations applied' : 'All migrations rolled back'} successfully.`);
  } catch (error) {
    console.error(`Error during ${action} migrations:`, error);
  } finally {
    mongoose.connection.close(); // Close the connection after applying migrations
  }
};

if (!action || (action !== 'up' && action !== 'down')) {
  console.error('Please specify an action: "up" to apply migrations or "down" to rollback.');
} else {
  runMigrations();
}
