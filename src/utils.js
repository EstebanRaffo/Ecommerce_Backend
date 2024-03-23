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


export const checkRequiredData = (req, res, next)=>{
    if(!checkValidFields(req.body)) return res.status(400).json({status:"error", message:"Uno o más datos obligatorios no fueron informados"});
    next();
}


// const profileMulterFilter = (req,file,cb)=>{
    //     // Si no se proporcionó ningún archivo, acepta la solicitud
    //     if (!file) {
    //         cb(null, true);
    //     } else {
        //         // Si se proporcionó un archivo, verifica si es válido
        //         // Aquí puedes agregar tu lógica para verificar si el archivo es válido
        //         // Por ejemplo, puedes verificar el tipo de archivo
        //         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        //             cb(null, true);
        //         } else {
        //             cb(null, false);
        //         }
        //     }
// }

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

const createDirectory = (dir)=>{
    const directory = path.join(__dirname, dir);
    if(!fs.existsSync(directory)) fs.mkdirSync(directory,{recursive:true});
    return directory;
}


const profileStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, createDirectory("/info/users/profiles"));
    },
    filename: function(req,file,cb){
        cb(null,`${req.body.email}-profile-${file.originalname}`);
    }
});
const uploadProfile = multer({storage:profileStorage, fileFilter:profileMulterFilter});


const documentsStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, createDirectory("/info/users/documents"));
    },
    filename: function(req,file,cb){
        cb(null,`${req.user.email}-document-${file.originalname}`);
    }
});
const uploadDocuments = multer({storage:documentsStorage});


const imgProductsStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, createDirectory("/info/products/img"));
    },
    filename: function(req,file,cb){
        cb(null,`${req.body.code}-product-${file.originalname}`);
    }
});
const uploadImgProducts = multer({storage:imgProductsStorage});

export {uploadProfile, uploadDocuments, uploadImgProducts};