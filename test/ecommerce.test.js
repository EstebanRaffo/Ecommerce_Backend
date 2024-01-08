import { app } from "../src/app.js";
import { expect } from "chai";
import supertest from "supertest";
import { createHash } from "../src/utils.js";
import { usersModel } from "../src/dao/mongo/models/users.model.js";

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
        it("Test POST /api/products/: Alta de Producto", ()=>{

        });
        it("Test PUT /api/products/:pid: Actualizar Producto", ()=>{

        });
        it("Test DELETE /api/products/:pid: Eliminar Producto", ()=>{
            
        });
    });

    describe("Testing Carrito de Compras", ()=>{
        it("Test POST /api/carts/: Crear Carrito", ()=>{

        });
        it("Test POST /:cid/products/:pid: Agregar producto en el carrito", ()=>{

        });
        it("Test DELETE /:cid/products/:pid: Eliminar Producto del carrito", ()=>{
            
        });
    });
});
