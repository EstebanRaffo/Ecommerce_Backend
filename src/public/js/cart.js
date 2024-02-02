var {hostname, port} = window.location;
const productList = document.getElementById("productList");

window.addEventListener("load", () => {
    const url = `http://${hostname}:${port}/api/sessions/current`;

    fetch(url)
        .then(response => {    
            if(!response.ok) {
                throw new Error('Hubo un problema al realizar la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const {user} = data;
            if(user.rol !== "admin") getCartInfo(user.cart);
        })
        .catch(error => console.error('Hubo un problema con la solicitud: ', error));
});

const getCartInfo = (cart_id) => {
    const url = `http://${hostname}:${port}/api/carts/${cart_id}`;

    fetch(url)
        .then(response => {    
            if(!response.ok) {
                throw new Error('Hubo un problema al realizar la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const {cart} = data;
            const {products} = cart;
            setCart(products);
        })
        .catch(error => console.error('Hubo un problema con la solicitud: ', error));
}

const setCart = (products) => {
    let list = "";
    products.forEach(item => {
        const {_id, quantity} = item
        const {title, price} = _id;
        console.log(quantity, title, price)
        list +=
            `<li>
                <p>Producto: ${title} <br> Precio: $ ${price} | Cantidad: ${quantity}</p>
            </li>`
        productList.innerHTML = list;
    });
}

const iniciarCompra = () => {
    const url = `http://${hostname}:${port}/api/payments/checkout`;
    console.log(url)
    window.location.replace(url);
}