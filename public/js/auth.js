const miFormulario = document.querySelector('form');

// Retorna la URL según si está local o desplegado
const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8081/api/auth/'
  : 'https://backend-basico-curso.onrender.com/api/auth/';

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of miFormulario.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value;
    }
    
    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(resp => resp.json())
    .then(data => {
        if (data.msg) {
            return console.error(data.msg);
        }
        
        // Guardar token y redirigir
        const token = data.token;
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err => {
        console.error('Error:', err);
    });
});

function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);

    console.log('ID: ' + responsePayload.sub);
    console.log('Name: ' + responsePayload.name);
    console.log('Image URL: ' + responsePayload.picture);
    console.log('Email: ' + responsePayload.email);

    // Obtener token
    const idToken = response.credential;
    // Guardar el token en el almacenamiento local
    fetch(url + 'google', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ idToken }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Mi server response: ', data);
        const token = data.token;
        if (token) {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        } else {
            console.error('Token not found in the response');
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    // Mostrar el botón de cerrar sesión si existe
    const signoutButton = document.getElementById('signout_button');
    if (signoutButton) {
        signoutButton.style.display = 'block';
    }
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function
        (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function signOut() {
    google.accounts.id.disableAutoSelect();
    console.log('User signed out.');
    const signoutButton = document.getElementById('signout_button');
    if (signoutButton) {
        signoutButton.style.display = 'none';
    }
}

window.onload = function() {
    google.accounts.id.initialize({
        client_id: '857831824854-rpec20an6280ksdas30rivpumoqrfv3k.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById('buttonDiv'), 
        { theme: 'outline', size: 'large' }
    );
    google.accounts.id.prompt(); // Mostrar el diálogo One Tap
};
