import express from 'express';
import places from '../controllers/placeController.js';
import uuidManagePlaces from './uuidManagePlace.routes.js';
import { verifyUUID } from '../middlewares/place.js';


const routes = express();


// /usuario/login/oauth
// /usuario/cadastro
// /usuario/logout
// /usuario/reset
// /usuario/update
// /usuario/favoritos
// /usuario/avaliacoes
// routes.use('/favoritos')
// routes.use('/avaliacoes')

// criar ou pedir acesso ao um place
routes.post('/request', places.requestCreation);
routes.use('/:uuid', verifyUUID, uuidManagePlaces)
// routes.delete('/remover')

export default routes;