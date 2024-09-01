// Retorna la URL según si está local o desplegado
const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8081/api/auth/'
  : 'https://backend-basico-curso.onrender.com/api/auth/';


let usuario = null;
let socket = null; 

//validar token del localStorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10) {
        window.locatio = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const respuesta = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, tokenDB } = await resp.json();
    console.log(userDB, tokenDB);

}

const main = async () => {

    //Validar JWT
    await validarJWT();
}