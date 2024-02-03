var {hostname, port, protocol, reload} = window.location;
const productList = document.getElementById("productList");
const totalAmount = document.getElementById("total"); 
var cart_id;
var total;

window.addEventListener("load", () => {
    const url = `${protocol}//${hostname}:${port}/api/sessions/current`;

    fetch(url)
        .then(response => {    
            if(!response.ok) {
                throw new Error('Error al realizar la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const {user} = data;
            cart_id = user.cart
            getCartInfo();
        })
        .catch(error => console.error('Error: ', error));
});

const getCartInfo = () => {
    const url = `${protocol}//${hostname}:${port}/api/carts/${cart_id}`;

    fetch(url)
        .then(response => {    
            if(!response.ok) {
                throw new Error('Error al realizar la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const {cart} = data;
            const {products} = cart;
            setCart(products);
            setTotalAmount(products);
        })
        .catch(error => console.error('Error: ', error));
}

const setCart = (products) => {
    let list = "";
    products.forEach(item => {
        const { _id, quantity } = item;
        const { title, price } = _id;
        const pid = _id._id;
    
        list +=
            `<li>
                <p>Producto: ${title} <br> Precio: ${formatterPeso(price)} | Cantidad: ${quantity}</p>
                <button onclick="deleteProductOfCart('${pid}')">Eliminar</button>
            </li>`
        productList.innerHTML = list;
    });
}

const setTotalAmount = (products) => {
    const total = products.reduce((sum, product) => sum + (product.quantity * product._id.price), 0);
    totalAmount.innerHTML = `Total: ${formatterPeso(total)}`;
}

function formatterPeso(value){
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(value)
}

const deleteProductOfCart = (pid) => {
    const url = `${protocol}//${hostname}:${port}/api/carts/${cart_id}/products/${pid}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al realizar la solicitud: ' + response.status);
        }
        return response.json();
    })
    .then(reload.bind(window.location))
    .catch(error => console.error('Error:', error));
}

const iniciarCompra = () => {
    const url = `${protocol}//${hostname}:${port}/api/payments/checkout`;
    window.location.replace(url);
}