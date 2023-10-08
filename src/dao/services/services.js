// import path from 'path';
// import { fileURLToPath } from 'url';
// import ProductManagerFS from '../files_managers/ProductManager.js';
// import CartManagerFS from '../files_managers/CartManager.js';
import { ProductsManagerMongo } from "../mongo/managers/ProductsManagerMongo.js";
import { CartsManagerMongo } from "../mongo/managers/CartsManagerMongo.js";
import { ChatManagerMongo } from "../mongo/managers/ChatManagerMongo.js"; 

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export const productsService = new ProductManagerFS(path.join(__dirname, "../files/products.json"));
// export const cartsService = new CartManagerFS(path.join(__dirname, "../files/carts.json"));

export const productsService = new ProductsManagerMongo();
export const cartsService = new CartsManagerMongo();
export const chatService = new ChatManagerMongo();