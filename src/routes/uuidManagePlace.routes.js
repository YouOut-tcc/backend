import express from 'express';
import places from '../controllers/placeController.js';

const routes = express();

// verificar permissoes do usuario 
routes.get('/informacoes', places.showInfo)
routes.post('/eventos', places.criarEventos)
routes.post('/promocoes', places.criarPromocao)
routes.post('/cupons', places.criarCupons)

export default routes;


