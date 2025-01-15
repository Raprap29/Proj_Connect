// src/services/UserService.ts

import { ConflictError, NotFoundError } from '@/utils/errors';
import UserModel from '../models/User';
import { decode, sign, verify } from 'hono/jwt'
import bcrypt from "bcryptjs";
class UserService {

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch; // true if the passwords match, false otherwise
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw error;
    }
  }
  
  // Create a new user
  async createUser(firstName: string, lastName: string, username: string, password: string) {
    try {

      const isExist = await UserModel.findOne({username: username});

      if(isExist){
        throw new ConflictError("This user is already exist.");
      }

      const user = UserModel.create({ firstName, lastName, username, password });
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

  async Login(username: string, password: string): Promise<string>{
    try{

      const checkUser = await UserModel.findOne({username});

      if(!checkUser){
        throw new NotFoundError("* Username and password is incorrect.")
      }

      const isValid = await this.verifyPassword(password, checkUser.password);

      if(!isValid){
        throw new Error("* Username and password is incorrect.");
      }

      const payload = {
        username: checkUser.username,
        firstName: checkUser.firstName,
        lastName: checkUser.lastName,
        auth: true,
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expiration in 5 minutes
      };

      const secretKey = "Iloveyou";

      const token = await sign(payload, secretKey);

      return token;
      
    }catch(error){
      throw new Error("Error login: " + error);
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
