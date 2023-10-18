import { usersModel } from "../models/users.model.js";

export class UsersManagerMongo{
    constructor(){
        this.model = usersModel;
    }

    async getUser(email){
        try {
            const user = await usersModel.findOne({email:email});
            return user;
        } catch (error) {
            console.log("getUsers: ", error.message);
            throw new Error("No se pudo consultar el usuario");
        }
    }

    isAdmin(loginForm){
        const email = loginForm.email;
        const password = loginForm.password;
        return email === process.env.USER_ADMIN && password === process.env.PASS_ADMIN;
    }

    async createUser(signupForm){
        try {
            const result = await usersModel.create(signupForm);
            return result;
        } catch (error) {
            console.log("createUser: ", error.message);
            throw new Error("No se pudo registrar el usuario");
        }
    }
}

