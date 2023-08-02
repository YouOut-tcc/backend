import express from 'express';
import places from '../controllers/placeController.js';

const routes = express();

// verificar permissoes do usuario 
routes.get('/coisa', places.showInfo)
routes.post('/eventos', places.criarEventos)
routes.post('/promocoes', places.criarPromocao)

export default routes;


