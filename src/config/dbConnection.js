import mongoose from "mongoose";

const db = process.env.URL_MONGO;

export const connectDB = async()=>{
    // `${db}`
    try{
        console.log(db)
        await mongoose.connect('')
        console.log("Base de datos conectada");
    }catch(error){
        console.log("Hubo un error al conectar a la base de datos: ", error.message);
    }
}