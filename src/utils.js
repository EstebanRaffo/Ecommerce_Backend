import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { config } from './config/config.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createHash = (password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync());
};

export const isValidPassword = (password,user)=>{
    return bcrypt.compareSync(password,user.password);
};

const PRIVATE_KEY = config.server.secretSession;

export const generateToken = (user) => {
    const {first_name, last_name, email} = user;
    const token = jwt.sign({first_name: first_name, last_name: last_name, email: email}, PRIVATE_KEY, {expiresIn:"1h"});
    return token;
}

export const verifyEmailToken = (token) => {
    try {
        const userInfo = jwt.verify(token, PRIVATE_KEY);
        return userInfo.email;
    } catch (error) {
        return null;
    }
}