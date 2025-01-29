import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const PATH_MIGRATE_SEED = process.env.MIGRATE_TEMPLATE_SEED;

if (!PATH_MIGRATE_SEED) {
  throw new Error("MIGRATE_MIGRATIONS_PATH is missing");
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);
// Directory where the models will be saved
const SEED_DIR = path.join(__dirname, PATH_MIGRATE_SEED);

// Ensure the 'models' directory exists
if (!fs.existsSync(SEED_DIR)) {
  fs.mkdirSync(SEED_DIR);
}

// Get arguments from the command line
const args = process.argv.slice(2);
const seederName = args[0];
const modelName = args[1]; // Model name (e.g., "userName")
const fieldsString = args[2]; // Fields string (e.g., "name:string,age:number")
const limitArg = args[3];

const limit = limitArg as number | undefined;

// Ensure modelName is a valid string
if (!modelName || !fieldsString || !seederName || !limit) {
  throw new Error('Model name is required and Field is required.');
}

// Parse fields string into an array of objects
const fields = fieldsString.split(',').map(fieldName => {
    
    if (!fieldName) {
      throw new Error('Invalid field format. Ensure fields are in the format "fieldName:type".');
    }
    return { fieldName };
  });

if(!fields){
    throw new Error("field is required");
}


// Function to generate a model file
const generateSeeder = (seederName: string, modelName: string, fields: { fieldName: string | undefined }[], limit: number) => {

    const modelFileName = `${seederName.charAt(0).toUpperCase() + seederName.slice(1)}.ts`; // Capitalize model name
    const modelFilePath = path.join(SEED_DIR, modelFileName);

    // Generate schema fields
    const schemaFields = Array.from({ length: 1 }, () => {
      return `{ ${fields.map(({ fieldName }) => `${fieldName}: "test"`).join(', ')} }`;
    }).join(',\n  ');

    // Template for model file
    const modelTemplate = `import ${modelName}Model from "../models/${modelName}"
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

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

const seeder${seederName} = async () => {
  const ${modelName}: any = [];

  Array.from({ length: ${limit} }, () => {
    Employee.push(${schemaFields})
  })

  try{
    await ${modelName}Model.deleteMany({});
    const createdData =  await ${modelName}Model.insertMany(${modelName});
    if(createdData){
      console.log("Success seeder");
    }
  }catch(e){
    return console.error(e);
  } finally {
    process.exit(); 
  }
}

seeder${seederName}();

`;

  // Write the model file to disk
  fs.writeFileSync(modelFilePath, modelTemplate);
  console.log(`Seeder file created: ${seederName}`);
};

generateSeeder(seederName, modelName, fields, limit);
