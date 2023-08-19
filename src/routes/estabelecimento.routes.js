import express from 'express';
import estabelecimento from '../controllers/estabeController.js';
import place from '../controllers/placeController.js';
import manage from './managePlace.routes.js';
import uuidPlaces from './uuidPlaces.routes.js';
import { verifyJWT } from '../middlewares/jwt.js';
import { verifyUUID } from '../middlewares/place.js';
import { verifyifPlace } from '../middlewares/loginType.js';

const routes = express();

routes.post('/login', estabelecimento.placeLogin);
routes.post('/cadastro', estabelecimento.placeCadastro);
// routes.post('/oauth', usuario.usuarioOauth)

routes.use(verifyJWT);

routes.get('/places', place.getPlaces)
routes.use('/places/:uuid', verifyUUID, uuidPlaces);

routes.use(verifyifPlace)

routes.delete('/delete', estabelecimento.placeDeletar)
// routes.post('/token', usuario.usuarioToken)
// routes.use('/logout')
// routes.use('/reset')
// routes.use('/update')

routes.use('/manage', manage);

export default routes;