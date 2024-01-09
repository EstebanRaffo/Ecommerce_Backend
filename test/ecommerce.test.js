import { app } from "../src/app.js";
import { expect } from "chai";
import supertest from "supertest";
import { createHash } from "../src/utils.js";
import { usersModel } from "../src/dao/mongo/models/users.model.js";
import { config } from "../src/config/config.js";
import { productsModel } from "../src/dao/mongo/models/products.model.js";
import { cartsModel } from "../src/dao/mongo/models/carts.model.js";

const requester = supertest(app);

describe("Testing Ecommerce", ()=>{

    describe("Testing Usuarios", ()=>{
        const mockUser = {
            first_name: "Juan",
            last_name: "Perez",
            email: "juan@coder.com",
            age: "30",
            password:createHash("1234")
        }

        let cookie;

        after(async()=>{
            await usersModel.findOneAndDelete({email: mockUser.email})
        });

        it("Test Registro de usuario -> POST /api/sessions/signup", async ()=>{
            const response = await requester.post("/api/sessions/signup").send(mockUser);
            expect(response.status).to.be.equal(200);
            expect(response.text.includes("Usuario registrado exitosamente")).to.be.equal(true);
            expect(response.request._data.email).to.be.equal(mockUser.email);
        });
        it("Test Login del nuevo usuario -> POST /api/sessions/login", async ()=>{
            const response = await requester.post("/api/sessions/login").send({
                email:mockUser.email,
                password: mockUser.password
            });
            expect(response.status).to.be.equal(200);
            expect(response._body.message).to.be.equal("Inicio de sesión exitoso");
            const cookieResult = response.header['set-cookie'][0];
            cookie = {
                name:cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            };
            expect(cookie.name).to.be.equal("connect.sid");
        });
        it("Test Obtener la Información del Usuario -> GET /api/sessions/current", async ()=>{
            const response = await requester.get("/api/sessions/current").set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.status).to.be.equal(200);
            expect(response._body.user.email).to.be.equal(mockUser.email);
        });
    });

    describe("Testing Productos", ()=>{
        const mockProduct = {
            "title": "Notebook TEST Lenovo Intel Core i5 8GB de RAM 480GB SSD Wind10 Home",
            "description": "NOTEBOOK TEST\" 326 x 226 x 18,4 mm - Peso: 1,65 kg",
            "code": "TEST",
            "status": true,
            "stock": 100,
            "price": 200000,
            "category": "notebooks",
            "thumbnails": ["https://i.postimg.cc/zB5zdtBS/notebook-1.png", 
                    "https://i.postimg.cc/Kc3bPhJS/notebook-2.png", 
                    "https://i.postimg.cc/CLjV2C3c/notebook-3.png",
                    "https://i.postimg.cc/K8xyhkFx/notebook-4.png",
                    "https://i.postimg.cc/g2sbzzkR/notebook-5.jpg"]
        }
        const updateData = {
            "title": "Notebook Modificada TEST", 
            "stock": 10,
            "price": 100000
        }
        let cookie;
        let pid;

        before(async ()=>{
            const response = await requester.post("/api/sessions/login").send({
                email: config.admin.user,
                password: config.admin.password
            });
            const cookieResult = response.header['set-cookie'][0];
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            };
        });

        after(async ()=>{
            await productsModel.findOneAndDelete({code: mockProduct.code});
        });

        it("Test Alta de Producto -> POST /api/products/", async ()=>{
            const response = await requester.post("/api/products/").send(mockProduct).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.status).to.be.equal(201);
            expect(response._body.data).to.have.property("_id");
            pid = response._body.data._id;
        });

        it("Test Actualización de Producto -> PUT /api/products/:pid", async ()=>{
            const response = await requester.put(`/api/products/${pid}`)
            .send(updateData).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.status).to.be.equal(201);
            expect(response._body.message).to.be.equal("Producto actualizado exitosamente");
            const { _id, title, stock, price } = response._body.data; 
            expect(_id).to.be.equal(pid);
            expect(title).to.be.equal(updateData.title);
            expect(stock).to.be.equal(updateData.stock);
            expect(price).to.be.equal(updateData.price);
        });

        it("Test Eliminar Producto -> DELETE /api/products/:pid", async ()=>{
            const response = await requester.delete(`/api/products/${pid}`).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.status).to.be.equal(201);
            expect(response._body.message).to.be.equal("Producto eliminado exitosamente");
            const result = await requester.get(`/api/products/${pid}`);
            expect(result.status).to.be.equal(200);
            expect(result.text).to.be.equal("No se encontró el producto buscado o no existe");
        });
    });

    describe("Testing Carrito de Compras", ()=>{
        let cookie;
        let cid;
        const pid = "651b65c6b8e03f977b791534";
        const quantity_test = 10;

        before(async ()=>{
            const response = await requester.post("/api/sessions/login").send({
                email: "test.user@test.com",
                password: "abc123"
            });
            const cookieResult = response.header['set-cookie'][0];
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            };
        });

        after(async ()=>{
            await cartsModel.findByIdAndDelete(cid);
        });

        it("Test Crear Carrito -> POST /api/carts/", async ()=>{
            const response = await requester.post("/api/carts/").set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.status).to.be.equal(201);
            expect(response._body.data).to.have.property("_id");
            cid = response._body.data._id;
        });
        it("Test Agregar producto en el carrito -> POST /:cid/products/:pid", async ()=>{
            const response = await requester.post(`/api/carts/${cid}/products/${pid}`).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.status).to.be.equal(201);
            const { _id, quantity } = response._body.data.products[0];
            expect(_id._id).to.be.equal(pid);
            expect(quantity).to.be.equal(1);
        });
        it("Test Actualizar cantidad del producto en el carrito -> PUT /:cid/products/:pid", async ()=>{
            const response = await requester.put(`/api/carts/${cid}/products/${pid}`)
            .send({"quantity": quantity_test}).set("Cookie",[`${cookie.name}=${cookie.value}`]);
            expect(response.status).to.be.equal(201);
            const { _id, quantity } = response._body.data.products[0];
            console.log(response._body.data.products[0])
            expect(_id._id).to.be.equal(pid);
            expect(quantity).to.be.equal(quantity_test);            
        });
    });
});
