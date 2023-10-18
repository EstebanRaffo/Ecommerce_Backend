import express from "express";
import { __dirname } from "./utils.js";
import path from "path";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { chatService, productsService } from "./dao/services/services.js";
import { connectDB } from "./config/dbConnection.js";
import { config } from 'dotenv';
import session from "express-session";
import MongoStore from "connect-mongo";


config();
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

const httpServer = app.listen(port, ()=>console.log("Servidor escuchando en el puerto: ", port));
const io = new Server(httpServer);

connectDB();

//configuración handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

app.use(session({
    store: MongoStore.create({
        ttl:3000,
        mongoUrl:process.env.URL_MONGO
    }),
    secret:"secretSessionBackend",
    resave:true,
    saveUninitialized:true
}));

app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);

let products_list = [];
let chat = [];

io.on("connection", async(socket)=>{
    console.log("cliente conectado");
    products_list = await productsService.getProducts();
    socket.emit("product_list", products_list);

    socket.on("new_product", async (data) => {
        await productsService.addProduct(data);
        products_list = await productsService.getProducts();
        io.emit("product_list", products_list); 
    });

    socket.on("delete_product", async (id) => {
        productsService.deleteProduct(id);
    });

    chat = await chatService.getMessages();
    //cuando se conecta el usuario, le enviamos el historial del chat
    socket.emit("chatHistory", chat);

    //recibimos el mensaje de cada usuario
    socket.on("msgChat", async (data)=>{
        
        await chatService.createMessage(data);
        chat = await chatService.getMessages();

        //enviamos el historial del chat a todos los usuarios conectados
        io.emit("chatHistory", chat)
    });

    //recibimos mensaje de conection de nuevo cliente
    socket.on("authenticated", (data)=>{
        socket.broadcast.emit("newUser",`El usuario ${data} se acaba de conectar`);
    })
});