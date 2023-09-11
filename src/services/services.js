import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname)
export const productsService = new ProductManager(path.join(__dirname, "../files/products.json"));
export const cartsService = new CartManager(path.join(__dirname, "../files/carts.json"));