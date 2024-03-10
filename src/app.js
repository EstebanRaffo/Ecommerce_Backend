import express from "express";
import { __dirname } from "./utils.js";
import path from "path";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { chatDao, productsDao } from "./dao/index.js";
import { connectDB } from "./config/dbConnection.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { config } from "./config/config.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { paymentsRouter } from "./routes/payments.routes.js";
import { logger } from "./helpers/logger.js";
import { swaggerSpecs } from "./config/swagger.config.js";
import swaggerUI from "swagger-ui-express";
import cors from "cors";

const port = config.server.port || 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public")));

const httpServer = app.listen(port, ()=>logger.info(`Servidor escuchando en el puerto: ${port}`));
const io = new Server(httpServer);

connectDB();

//configuración handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

app.use(session({
    store: MongoStore.create({
        ttl:3000,
        mongoUrl:config.mongo.url
    }),
    secret:config.server.secretSession,
    resave:true,
    saveUninitialized:true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(viewsRouter);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use(errorHandler);

let products_list = [];
let chat = [];

io.on("connection", async(socket)=>{
    logger.info("cliente conectado");
    products_list = await productsDao.getProducts();
    socket.emit("product_list", products_list.docs);

    socket.on("new_product", async (data) => {
        await productsDao.createProduct(data);
        products_list = await productsDao.getProducts();
        io.emit("product_list", products_list.docs); 
    });

    socket.on("delete_product", async (id) => {
        await productsDao.deleteProduct(id);
    });

    chat = await chatDao.getMessages();
    //cuando se conecta el usuario, le enviamos el historial del chat
    socket.emit("chatHistory", chat);

    //recibimos el mensaje de cada usuario
    socket.on("msgChat", async (data)=>{
        
        await chatDao.createMessage(data);
        chat = await chatDao.getMessages();

        //enviamos el historial del chat a todos los usuarios conectados
        io.emit("chatHistory", chat)
    });

    //recibimos mensaje de conection de nuevo cliente
    socket.on("authenticated", (data)=>{
        socket.broadcast.emit("newUser",`El usuario ${data} se acaba de conectar`);
    })
});

export {app};