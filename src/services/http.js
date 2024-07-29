import axios from 'axios'

// Obtém a URL raiz do navegador
const urlNavegador = window.location.origin;

// Define a URL base com base na URL raiz
let baseURL  = 'http://backendcodegroup.codigogame.com.br/api';

if (urlNavegador === 'http://localhost:5173') {
    baseURL = 'http://localhost/api';
    console.log("Ambiente LocalHost")

}

console.log(baseURL)

const axiosInstace = axios.create({
    baseURL,
    'Content-type': 'application/json',
});

export default axiosInstace;
