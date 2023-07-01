import express from 'express';
import usuarios from './usuario.routes.js';

const routes = express();
// /login/estabelicimento/oauth
// /login/estabelicimento/login
// /login/login/usuario

// routes.use('/estabelicimento')
routes.use('/usuario', usuarios)

export default routes;