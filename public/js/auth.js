
const miFormulario = document.querySelector('form');


// Retorna la URL según si está local o desplegado
const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8081/api/auth/'
  : 'https://backend-basico-curso.onrender.com/api/auth/';


  miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for( let el of miFormulario.elements ) {
        if ( el.name.length > 0 ) 
            formData[el.name] = el.value
    }
    
    
    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if( msg ){
            return console.error( msg );
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log(err)
    })
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
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Mi server response: ', data);
    })
    .then( ({ token }) => {
        localStorage.setItem('token', token);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });

  // Mostrar el botón de cerrar sesión
  document.getElementById('signout_button').style.display = 'block';
}

function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function signOut() {
  google.accounts.id.disableAutoSelect();
  console.log('User signed out.');
  // Ocultar el botón de cerrar sesión
  document.getElementById('signout_button').style.display = 'none';
}

window.onload = function() {
  google.accounts.id.initialize({
    client_id: '857831824854-rpec20an6280ksdas30rivpumoqrfv3k.apps.googleusercontent.com',
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById('buttonDiv'), 
    { theme: 'outline', size: 'large' }  // customization attributes
  );
  google.accounts.id.prompt(); // also display the One Tap dialog
};