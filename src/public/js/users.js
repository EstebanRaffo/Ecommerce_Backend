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