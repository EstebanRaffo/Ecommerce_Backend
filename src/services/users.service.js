import { usersDao } from "../dao/index.js";

export class UsersService{

    static async getUser(email){
        try {
            const result = await usersDao.getUser(email);
            return result;    
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(id){
        try {
            const result = await usersDao.getUserById(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async createUser(new_user){
        try {
            const result = await usersDao.createUser(new_user);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(id, info){
        try {
            const result = await usersDao.updateUser(id, info);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getAllUsers(){
        try {
            const result = await usersDao.getAllUsers();
            return result;    
        } catch (error) {
            throw error;
        }
    }

    static async deleteUsers(inactive_users_ids){
        try {
            const result = await usersDao.deleteUsers(inactive_users_ids);
            return result;    
        } catch (error) {
            throw error;
        }
    }
}