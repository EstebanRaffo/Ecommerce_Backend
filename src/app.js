import express from "express";
import { __dirname } from "./utils.js";
import path from "path";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { productsService } from "./services/services.js";

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

const httpServer = app.listen(port, ()=>console.log("Servidor escuchando en el puerto: ", port));
const io = new Server(httpServer);

//configuración handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


let products_list = [];
io.on("connection", async(socket)=>{
    products_list = await productsService.getProducts();
    socket.emit("product_list", products_list);

    socket.on("new_product", async (data) => {
        const {title, description, price, thumbnails, code, stock, category, status} = data;
        await productsService.addProduct(title, description, price, thumbnails, code, stock, category, status);
        products_list = await productsService.getProducts();
        io.emit("product_list", products_list); 
    });

    socket.on("delete_product", async (id) => {
        productsService.deleteProduct(id);
    });
});