import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from '../ProductManager';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const productsService = new ProductManager(path.join(__dirname, "/files/products.json"));