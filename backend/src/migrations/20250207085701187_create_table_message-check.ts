import mongoose from 'mongoose';

// The "up" method is responsible for applying the migration
export const up = async (): Promise<void> => {
  // Write migration code here to apply changes to the database

    const message_checkSchema = new mongoose.Schema({
      userId: { type: String, require: true },
      ticketId: { type: String, require: true },
      status: { type: Number, required: true },
    });

  // Check if collection already exists to avoid duplicates
  if (!mongoose.connection.collections['messagechecks']) {
    await mongoose.model('Messagecheck', message_checkSchema).createCollection();
    console.log('Message-check collection created.');
  } else {
    console.log('Message-check collection already exists.');
  }

};

// The "down" method is used to rollback the migration
export const down = async (): Promise<void> => {
  // Write rollback code here to undo the changes made in "up"

  const collection = mongoose.connection.collections['messagechecks'];
    if (collection) {
      await collection.drop();
      console.log('Message-check collection dropped.');
    } else {
      console.log('Message-check collection does not exist.');
    }

};
