import axios from 'axios';

// Cria uma instância do axios com a URL base do GitHub
const api = axios.create({
  baseURL: 'https://api.github.com',
});

// Nota: Sem autenticação, o GitHub limita a 60 requisições por hora por IP.
// Para um trabalho acadêmico, geralmente é suficiente.
export default api;