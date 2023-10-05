import mongoose from "mongoose";

export const connectDB = async()=>{
    // const dbConfig = {
    //     apiKey: process.env.URL_MONGO_apiKey
    // }
    // console.log(dbConfig.apiKey)
    try{
        await mongoose.connect('')
        console.log("Base de datos conectada");
    }catch(error){
        console.log("Hubo un error al conectar a la base de datos: ", error.message);
    }
}