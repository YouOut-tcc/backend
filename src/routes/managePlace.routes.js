import express from 'express';
import estabelecimento from '../controllers/estabeController.js';
import places from '../controllers/placeController.js';
import uuidManagePlaces from './uuidManagePlace.routes.js';
import { verifyUUID } from '../middlewares/place.js';
import permissions from "../middlewares/permissions.js";

const routes = express();

routes.post('/request', permissions.isRoot, places.requestCreation);

// routes.get('/places', estabelecimento.getLinkedPlaces)
routes.get('/permissions', estabelecimento.getPermissions)
routes.put('/permissions', estabelecimento.setPermissions)


routes.use('/:uuid', verifyUUID, uuidManagePlaces)

// /usuario/login/oauth
// /usuario/cadastro
// /usuario/logout
// /usuario/reset
// /usuario/update
// /usuario/favoritos
// /usuario/avaliacoes
// routes.use('/favoritos')
// routes.use('/avaliacoes')


// /estabelecimento/manage - get lista todos os places linkados; 
// /estabelecimento/manage/request - criar um place e passar para os adm para permitir
// /estabelecimento/manage/uuid/ - rota para gerenciar um restaurante individial
// /estabelecimento/manage/uuid/maiscoisas

// criar ou pedir acesso ao um place

// routes.delete('/remover')

export default routes;