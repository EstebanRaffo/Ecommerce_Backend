// const usersList = document.getElementById("users");

// window.addEventListener("load", ()=>{
//     const url = `http://localhost:8080/api/users/`;

//     fetch(url, {
//         method: "GET", 
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Hubo un problema al realizar la solicitud: ' + response.status);
//         }
//         return response.json();
//       })
//         .then(result => {
//             const users = result.data;
//             console.log("users: ", users)
//             generarListaDeUsuarios(users);
//         })
//         .catch((error) => console.error("Error:", error))
// });    

var {hostname, port, reload} = window.location;

const eliminarInactivos = () => {
    const url = `http://${hostname}:${port}/api/users/`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al intentar eliminar cuentas inactivas');
            }
            alert('Las cuentas inactivas han sido eliminadas');
        })
        .then(reload.bind(window.location))
        .catch(error => console.error('Error: ', error));
}

const switchRol = (id) => {
    const url = `http://${hostname}:${port}/api/users/premium/${id}/`;
    
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al intentar modificar rol de usuario');
            }
            return response.json();            
        })
        .then(reload.bind(window.location))
        .catch(error => console.error('Error:', error));
}