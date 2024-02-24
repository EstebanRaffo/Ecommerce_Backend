import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { config } from './config/config.js';
import fs from 'fs';

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


const checkValidFields = (user)=>{
    const {first_name, email, password} = user;
    if(!first_name || !email || !password){
        return false;
    } else {
        return true;
    }
};

const profileMulterFilter = (req,file,cb)=>{
    if(!checkValidFields(req.body)){
        cb(null, false);
    } else {
        cb(null, true);
    }
};


const makeDirectory = (dir)=>{
    const directory = path.join(__dirname, dir);
    if(!fs.existsSync(directory)) fs.mkdirSync(directory,{recursive:true});
    return directory;
}


const profileStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, makeDirectory("/info/users/profiles"));
    },
    filename: function(req,file,cb){
        cb(null,`${req.body.email}-perfil-${file.originalname}`);
    }
});
const uploadProfile = multer({storage:profileStorage, fileFilter:profileMulterFilter});


const documentsStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, makeDirectory("/info/users/documents"));
    },
    filename: function(req,file,cb){
        cb(null,`${req.user.email}-document-${file.originalname}`);
    }
});
const uploadDocuments = multer({storage:documentsStorage});


const imgProductsStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, makeDirectory("/info/products/img"));
    },
    filename: function(req,file,cb){
        cb(null,`${req.body.code}-product-${file.originalname}`);
    }
});
const uploadImgProducts = multer({storage:imgProductsStorage});

export {uploadProfile, uploadDocuments, uploadImgProducts};