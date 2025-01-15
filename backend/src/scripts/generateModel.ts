import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const PATH_MIGRATE_MODEL = process.env.MIGRATE_TEMPLATE_MODEL;

if (!PATH_MIGRATE_MODEL) {
  throw new Error("MIGRATE_MIGRATIONS_PATH is missing");
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);
// Directory where the models will be saved
const MODELS_DIR = path.join(__dirname, PATH_MIGRATE_MODEL);

// Ensure the 'models' directory exists
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR);
}

// Get arguments from the command line
const args = process.argv.slice(2);
const modelName = args[0]; // Model name (e.g., "userName")
const fieldsString = args[1]; // Fields string (e.g., "name:string,age:number")

// Ensure modelName is a valid string
if (!modelName || !fieldsString) {
  throw new Error('Model name is required and Field is required.');
}

// Parse fields string into an array of objects
const fields = fieldsString.split(',').map(field => {
    const [fieldName, fieldType] = field.split(':');
    if (!fieldName || !fieldType) {
      throw new Error('Invalid field format. Ensure fields are in the format "fieldName:type".');
    }
    return { fieldName, fieldType };
  });

if(!fields){
    throw new Error("field is required");
}

// Function to generate a model file
const generateModelFile = (modelName: string, fields: { fieldName: string | undefined, fieldType: string | undefined }[]) => {
  const modelFileName = `${modelName.charAt(0).toUpperCase() + modelName.slice(1)}.ts`; // Capitalize model name
  const modelFilePath = path.join(MODELS_DIR, modelFileName);

  // Generate schema fields
  let schemaFields = '';
  fields.forEach(({ fieldName, fieldType }) => {
    schemaFields += `  ${fieldName}: { type: ${getFieldType(fieldType || "")}, required: true },\n`;
  });

  // Template for model file
  const modelTemplate = `import { Schema, model, Document, Model } from 'mongoose';

interface I${modelName.charAt(0).toUpperCase() + modelName.slice(1)} extends Document {
${fields.map(({ fieldName, fieldType }) => `  ${fieldName}: ${getFieldTypeTypeScript(fieldType || "")};`).join('\n')}
}

const ${modelName.charAt(0).toUpperCase() + modelName.slice(1)}Schema = new Schema<I${modelName.charAt(0).toUpperCase() + modelName.slice(1)}>({
${schemaFields}}, {
  timestamps: true,
});

${modelName.charAt(0).toUpperCase() + modelName.slice(1)}Schema.pre<I${modelName.charAt(0).toUpperCase() + modelName.slice(1)}>('save', async function(next){
   
});

const ${modelName.charAt(0).toUpperCase() + modelName.slice(1)}Model: Model<I${modelName.charAt(0).toUpperCase() + modelName.slice(1)}> = model<I${modelName.charAt(0).toUpperCase() + modelName.slice(1)}>("${modelName.charAt(0).toUpperCase() + modelName.slice(1)}", ${modelName.charAt(0).toUpperCase() + modelName.slice(1)}Schema);

export default ${modelName.charAt(0).toUpperCase() + modelName.slice(1)}Model;
`;

  // Write the model file to disk
  fs.writeFileSync(modelFilePath, modelTemplate);
  console.log(`Model file created: ${modelFileName}`);
};

// Helper function to map field types
const getFieldType = (fieldType: string) => {
  switch (fieldType) {
    case 'string':
      return 'String';
    case 'number':
      return 'Number';
    case 'boolean':
      return 'Boolean';
    case 'date':
      return 'Date';
    default:
      throw new Error(`Unsupported field type: ${fieldType}`);
  }
};

// Helper function to map field types to TypeScript types
const getFieldTypeTypeScript = (fieldType: string) => {
  switch (fieldType) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'Date';
    default:
      throw new Error(`Unsupported field type: ${fieldType}`);
  }
};

// Generate the model file
generateModelFile(modelName, fields);
