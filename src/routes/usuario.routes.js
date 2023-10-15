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

routes.get('/favoritos', usuario.getFavoritos)
routes.get('/avaliacoes', usuario.getAvaliacoes)
routes.get('/informacoes', usuario.getInformacoesUser)
routes.post('/update-informacoes', usuario.usuarioUpdate)
routes.post('/pesquisar', usuario.pesquisarPlace);
routes.post('/pesquisar/tag/:tagId', usuario.pesquisarPlaceTag);
// routes.use('/logout')
// routes.use('/reset')
// routes.use('/update')

export default routes;
