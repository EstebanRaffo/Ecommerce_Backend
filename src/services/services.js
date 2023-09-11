import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from '../ProductManager';
import CartManager from '../CartManager';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const productsService = new ProductManager(path.join(__dirname, "/files/products.json"));
export const cartsService = new CartManager(path.join(__dirname, "/files/carts.json"));