// import { logger } from "../../helpers/logger.js";

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

// const generarListaDeUsuarios = (users) => {
//     let list = "";
//     users.forEach(user => {
//         list += 
//         `<li>
//             <p>${user.fullname}</p><button onclick="switchRol(${user._id})">Cambiar Rol</button>
//         </li>`
//     });
//     usersList.innerHTML = list;
// }

const eliminarInactivos = () => {
    console.log("Click en Eliminar Inactivos")
}

const switchRol = (id) => {
    console.log("Click en Cambiar Rol id: ", id)
}