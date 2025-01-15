import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Manually define __dirname for ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// Access environment variables
const MIGRATE_MONGO_URI = process.env.MIGRATE_MONGO_URI;

if (!MIGRATE_MONGO_URI) {
  throw new Error('MIGRATE_MONGO_URI environment variable is missing!');
}

console.log('Mongo URI:', MIGRATE_MONGO_URI);

const PATH_MIGRATE = process.env.MIGRATE_MIGRATIONS_PATH;

if (!PATH_MIGRATE) {
  throw new Error("MIGRATE_MIGRATIONS_PATH is missing");
}

const migrationDir = path.join(__dirname, PATH_MIGRATE);

// Function to generate a migration file
const generateMigrationFile = (name: string) => {
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir, { recursive: true }); // Ensure the directory exists
  }

  // Get a timestamp for the migration file name
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, ''); // ISO string without special characters
  const migrationFileName = `${timestamp}_${name}.ts`; // Example: 20250115093000_create_users_collection.ts
  const nameTable = name.split("_")[2];
  
  if(!nameTable) {
    throw new Error("Required");
  }

  const migrationTemplate = `import mongoose from 'mongoose';

// The "up" method is responsible for applying the migration
export const up = async (): Promise<void> => {
  // Write migration code here to apply changes to the database

   const ${nameTable.toLowerCase()}Schema = new mongoose.Schema({
   
    });

  // Check if collection already exists to avoid duplicates
  if (!mongoose.connection.collections['${nameTable.toLowerCase()}s']) {
    await mongoose.model('${nameTable.charAt(0).toUpperCase() + nameTable.slice(1)}', ${nameTable.toLowerCase()}Schema).createCollection();
    console.log('${nameTable.charAt(0).toUpperCase() + nameTable.slice(1)} collection created.');
  } else {
    console.log('${nameTable.charAt(0).toUpperCase() + nameTable.slice(1)} collection already exists.');
  }

};

// The "down" method is used to rollback the migration
export const down = async (): Promise<void> => {
  // Write rollback code here to undo the changes made in "up"

  const collection = mongoose.connection.collections['${nameTable.toLowerCase()}s'];
    if (collection) {
      await collection.drop();
      console.log('${nameTable.charAt(0).toUpperCase() + nameTable.slice(1)} collection dropped.');
    } else {
      console.log('${nameTable.charAt(0).toUpperCase() + nameTable.slice(1)} collection does not exist.');
    }

};
`;

  const migrationFilePath = path.join(migrationDir, migrationFileName);

  fs.writeFileSync(migrationFilePath, migrationTemplate);
  console.log(`Migration file created: ${migrationFileName}`);
}

// Get the migration name from the command line arguments
const migrationName = process.argv[2]; // Name provided via command line
if (migrationName) {
  generateMigrationFile(migrationName);
} else {
  console.error('Please provide a migration name.');
}
