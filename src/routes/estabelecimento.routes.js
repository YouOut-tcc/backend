import express from 'express';
import estabelecimento from '../controllers/estabeController.js';
import places from './place.routes.js';
import uuidPlaces from './uuidPlaces.routes.js';
import { verifyJWT } from '../middlewares/jwt.js';
import { verifyUUID } from '../middlewares/place.js';

const routes = express();

//veincular login para estabelecimento


routes.post('/login', estabelecimento.placeLogin)
routes.post('/cadastro', estabelecimento.placeCadastro)
// routes.post('/oauth', usuario.usuarioOauth)

routes.use(verifyJWT)

// routes.post('/token', usuario.usuarioToken)

// /estabelecimento/manage - get lista todos os places linkados; 
// /estabelecimento/manage/request - criar um place e passar para os adm para permitir
// /estabelecimento/manage/uuid/ - rota para gerenciar um restaurante individial
// /estabelecimento/manage/uuid/maiscoisas

// qualquer conta com u token valido pode entrar aqui, mudar isso

// routes.use('/logout')
// routes.use('/reset')
// routes.use('/update')

routes.use('/manage', places)
routes.use('/:uuid', verifyUUID, uuidPlaces)

export default routes;