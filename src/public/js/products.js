var {hostname, port, protocol, reload} = window.location;
var cart_id;

window.addEventListener("load", () => {
    const url = `${protocol}//${hostname}:${port}/api/sessions/current`;

    fetch(url)
        .then(response => {    
            if(!response.ok) {
                throw new Error('Hubo un problema al realizar la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const {user} = data;
            cart_id = user.cart;
        })
        .catch(error => console.error('Hubo un problema con la solicitud: ', error));
});

const addToCart = (pid)=>{
    const url = `${protocol}//${hostname}:${port}/api/carts/${cart_id}/products/${pid}`;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      }
    };

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => Swal.fire('', data.message, 'info'))
      .catch(error => console.error('Error al realizar la solicitud:', error));
}