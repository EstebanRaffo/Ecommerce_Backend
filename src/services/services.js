import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from '../managersFiles/ProductManager.js';
import CartManager from '../managersFiles/CartManager.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname)
export const productsService = new ProductManager(path.join(__dirname, "../files/products.json"));
export const cartsService = new CartManager(path.join(__dirname, "../files/carts.json"));