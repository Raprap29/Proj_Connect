// src/services/UserService.ts

import UserModel from '../models/User';

class UserService {
  // Create a new user
  async createUser(name: string, email: string, age: number) {
    try {
      const user = UserModel.create({ name, email, age });
      return user;
    } catch (error) {
      throw new Error('Error creating user: ' + error);
    }
  }

  // Get all users
  async getAllUsers() {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw new Error('Error fetching users: ' + error);
    }
  }

  // Get user by ID
  async getUserById(userId: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      throw new Error('Error fetching user: ' + error);
    }
  }

  // Update user by ID
  async updateUser(userId: string, name: string, email: string, age: number) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { name, email, age },
        { new: true } // Return the updated user
      );
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      throw new Error('Error updating user: ' + error);
    }
  }

  // Delete user by ID
  async deleteUser(userId: string) {
    try {
      const user = await UserModel.findByIdAndDelete(userId);
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      throw new Error('Error deleting user: ' + error);
    }
  }
}

export default new UserService();
