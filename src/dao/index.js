// import path from 'path';
// import { fileURLToPath } from 'url';
// import ProductManagerFS from '../files_managers/ProductManager.js';
// import CartManagerFS from '../files_managers/CartManager.js';
import { ProductsManagerMongo } from "./mongo/managers/ProductsManagerMongo.js";
import { CartsManagerMongo } from "./mongo/managers/CartsManagerMongo.js";
import { ChatManagerMongo } from "./mongo/managers/ChatManagerMongo.js"; 
import { UsersManagerMongo } from "./mongo/managers/UsersManagerMongo.js";
import { TicketsManagerMongo } from "./mongo/managers/TicketsManagerMongo.js";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export const productsService = new ProductManagerFS(path.join(__dirname, "../files/products.json"));
// export const cartsService = new CartManagerFS(path.join(__dirname, "../files/carts.json"));

export const productsDao = new ProductsManagerMongo();
export const cartsDao = new CartsManagerMongo();
export const chatDao = new ChatManagerMongo();
export const usersDao = new UsersManagerMongo();
export const ticketsDao = new TicketsManagerMongo();