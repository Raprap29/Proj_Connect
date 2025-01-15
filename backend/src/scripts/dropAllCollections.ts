import mongoose from 'mongoose';
import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

async function dropAllCollections() {
  const connection = mongoose.connection;
  
    if(!connection.db) {
        throw new Error("Required");
    }

  try {
    // Get a list of all collections in the current database
    const collections = await connection.db.listCollections().toArray();

    for (const collection of collections) {
      const collectionName = collection.name;

      // Drop each collection
      await connection.db.dropCollection(collectionName);
      console.log(`Collection ${collectionName} dropped successfully.`);
    }

    console.log('All collections have been dropped successfully.');
  } catch (error) {
    console.error('Error dropping collections:', error);
  } finally {
    // Close the connection after operation
    mongoose.connection.close();
  }
}

// Connect to the database and drop all collections
async function main() {
    const PATH_MIGRATE = process.env.MIGRATE_MONGO_URI;

    if (!PATH_MIGRATE) {
        throw new Error("MIGRATE_MONGO_URI is missing");
    }
    await mongoose.connect(PATH_MIGRATE);

    await dropAllCollections();
}

main().catch(console.error);
