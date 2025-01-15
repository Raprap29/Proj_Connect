import mongoose from 'mongoose';

// The "up" method is responsible for applying the migration
export const up = async (): Promise<void> => {
  // Write migration code here to apply changes to the database

  const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  // Check if collection already exists to avoid duplicates
  if (!mongoose.connection.collections['users']) {
    await mongoose.model('User', userSchema).createCollection();
    console.log('User collection created.');
  } else {
    console.log('User collection already exists.');
  }

};

// The "down" method is used to rollback the migration
export const down = async (): Promise<void> => {
  // Write rollback code here to undo the changes made in "up"

  const collection = mongoose.connection.collections['users'];
    if (collection) {
      await collection.drop();
      console.log('User collection dropped.');
    } else {
      console.log('User collection does not exist.');
    }

};
