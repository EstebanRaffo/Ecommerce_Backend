import { config } from 'dotenv';
import mongoose from "mongoose";

export const connectDB = async()=>{
    config();
    try{
        await mongoose.connect(process.env.URL_MONGO);
        console.log("Base de datos conectada");
    }catch(error){
        console.log("Hubo un error al conectar a la base de datos: ", error.message);
    }
}