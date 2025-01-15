import mongoose from 'mongoose';

// The "up" method is responsible for applying the migration
export const up = async (): Promise<void> => {
  // Write migration code here to apply changes to the database

    const employeeSchema = new mongoose.Schema({
   
    });

  // Check if collection already exists to avoid duplicates
  if (!mongoose.connection.collections['employees']) {
    await mongoose.model('Employee', employeeSchema).createCollection();
    console.log('Employee collection created.');
  } else {
    console.log('Employee collection already exists.');
  }

};

// The "down" method is used to rollback the migration
export const down = async (): Promise<void> => {
  // Write rollback code here to undo the changes made in "up"

  const collection = mongoose.connection.collections['employees'];
    if (collection) {
      await collection.drop();
      console.log('Employee collection dropped.');
    } else {
      console.log('Employee collection does not exist.');
    }

};
