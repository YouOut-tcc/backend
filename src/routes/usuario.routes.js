import express from 'express';
import usuario from '../controllers/usuarioController.js'
import { verifyJWT } from '../middlewares/jwt.js';

const routes = express();
// /usuario/login/oauth
// /usuario/cadastro
// /usuario/logout
// /usuario/reset
// /usuario/update
// /usuario/favoritos
// /usuario/avaliacoes

routes.post('/login', usuario.usuarioLogin)
routes.post('/cadastro', usuario.usuarioCadastro)
routes.post('/oauth', usuario.usuarioOauth)

routes.use(verifyJWT)

routes.post('/token', usuario.usuarioToken)

// routes.use('/logout')
// routes.use('/reset')
// routes.use('/update')
// routes.use('/favoritos')
// routes.use('/avaliacoes')

export default routes;