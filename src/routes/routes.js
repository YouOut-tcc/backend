import express from 'express';
import usuarios from './usuario.routes.js';
import estabelecimento from './estabelecimento.routes.js';

const routes = express();

routes.use('/estabelecimento', estabelecimento);
routes.use('/usuario', usuarios);

export default routes;