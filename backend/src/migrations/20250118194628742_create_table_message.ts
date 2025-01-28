import mongoose from 'mongoose';

// The "up" method is responsible for applying the migration
export const up = async (): Promise<void> => {
  // Write migration code here to apply changes to the database

   const messageSchema = new mongoose.Schema({
      userId: { type: String, require: true },
      ticketId: { type: String, require: true },
      message: { type: String, required: true },
      status: { type: Number, required: true },
    });

  // Check if collection already exists to avoid duplicates
  if (!mongoose.connection.collections['messages']) {
    await mongoose.model('Message', messageSchema).createCollection();
    console.log('Message collection created.');
  } else {
    console.log('Message collection already exists.');
  }

};

// The "down" method is used to rollback the migration
export const down = async (): Promise<void> => {
  // Write rollback code here to undo the changes made in "up"

  const collection = mongoose.connection.collections['messages'];
    if (collection) {
      await collection.drop();
      console.log('Message collection dropped.');
    } else {
      console.log('Message collection does not exist.');
    }

};
