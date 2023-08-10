import express from 'express';
import places from '../controllers/placeController.js';
import estabelecimento from '../controllers/estabeController.js';
import permissions from "../middlewares/permissions.js";

const routes = express();


routes.post('/link', estabelecimento.linkLogin);
routes.post('/cadastrar', permissions.CADASTRAR, estabelecimento.createLoginChild);

// verificar permissoes do usuario 
routes.get('/informacoes', places.showInfo)
routes.post('/eventos', places.criarEventos)
routes.post('/promocoes', places.criarPromocao)
routes.post('/cupons', places.criarCupons)

export default routes;


