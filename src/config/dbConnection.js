import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        await mongoose.connect('')
        console.log("Base de datos conectada");
    }catch(error){
        console.log("Hubo un error al conectar a la base de datos: ", error.message);
    }
}