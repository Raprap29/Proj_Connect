// src/services/UserService.ts

import { ConflictError, NotFoundError, RequiredError } from '@/utils/errors';
import EmployeeModel from '../models/Employee';
import { decode, sign } from 'hono/jwt'
import bcrypt from "bcryptjs";
class EmployeeService {

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
  async createUser(firstName: string, lastName: string, username: string, password: string, role: number) {
    try {

      const isExist = await EmployeeModel.findOne({username: username});

      if(isExist){
        throw new ConflictError("This user is already exist.");
      }

      const user = EmployeeModel.create({ firstName, lastName, username, password, role });
      return user;
    } catch (error) {
      throw new Error('Error creating user: ' + error);
    }
  }

  // Get all users
  async getAllUsers(page: number, searchQuery: string = "") {
    try {
      const limit = 10;
      const skip = (page - 1) * limit;

      const searchCondition = {
        $or: [
          { username: { $regex: searchQuery, $options: 'i' } },
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] },
           regex: searchQuery, options: 'i' } } }
        ],
      };

      const totalUsers = await EmployeeModel.countDocuments(searchCondition);

      const totalPage = Math.ceil(totalUsers / limit);

      const users = await EmployeeModel.find(searchCondition).limit(limit).skip(skip);
      return {users: users, totalPage: totalPage};
    } catch (error) {
      throw new Error('Error fetching users: ' + error);
    }
  }

  async Login(username: string, password: string): Promise<any>{

      const checkUser = await EmployeeModel.findOne({username});

      if(!checkUser){
        throw new NotFoundError("* Username and password do not match.")
      }

      const isValid = await this.verifyPassword(password, checkUser.password);

      if(!isValid){
        throw new NotFoundError("* Username and password do not match.");
      }

      const payload = {
        id: checkUser._id,
        username: checkUser.username,
        firstName: checkUser.firstName,
        lastName: checkUser.lastName,
        auth: true,
        role: checkUser.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // Token expiration in 5 minutes
      };

      const secretKey = "Iloveyou";

      const token = await sign(payload, secretKey);

      return {token: token, id: checkUser._id, username: checkUser.username};
      
  }

  // Get user by ID
  async getUserById(userId: string) {
    try {
      const user = await EmployeeModel.findById(userId);
      if (!user) throw new NotFoundError('User not found');
      return user;
    } catch (error) {
      throw new Error('Error fetching user: ' + error);
    }
  }

  // Update user by ID
  async updateUser(userId: string, firstName: string, lastName: string, username: string, password: string) {
    try {

      const updateData: any = {
        firstName,
        lastName,
        username,
      };

      if(!updateData.firstName ||
        !updateData.lastName ||
        !updateData.username
      ){
        throw new RequiredError("* Required all fields");
      }

      if(password){
        const salt = 12;
        const passwordHash = await bcrypt.hash(password, salt);
        updateData.password = passwordHash;
      }

      const existingUser = await EmployeeModel.findOne({username: username, _id: {$ne: userId}});

      if (existingUser) {
        throw new ConflictError('Username is already taken');
      }

      const user = await EmployeeModel.findByIdAndUpdate(
        userId,
        updateData,
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
      const user = await EmployeeModel.findByIdAndDelete(userId);
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      throw new Error('Error deleting user: ' + error);
    }
  }
}

export default new EmployeeService();
