import express from "express";
import { productsRouter } from "./routes/products.routes";


const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(port, ()=>console.log("Servidor escuchando en el puerto: ", port));

app.use("/api/products", productsRouter);
app.use("/api/carts");