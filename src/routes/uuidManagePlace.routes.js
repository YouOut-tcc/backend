import express from 'express';
import places from '../controllers/placeController.js';
import estabelecimento from '../controllers/estabeController.js';
import permissions from "../middlewares/permissions.js";
import { upload } from '../helpers/image.js';

const routes = express();


routes.post('/link', estabelecimento.linkLogin);
routes.post('/cadastrar', permissions.CADASTRAR, estabelecimento.createLoginChild);

// verificar permissoes do usuario 
routes.get('/informacoes', places.showInfo);
routes.post('/banners', upload.array('banners', 5), places.updateBanner);
routes.post('/eventos', upload.single('image'), places.criarEventos)
routes.post('/promocoes', places.criarPromocao)
routes.post('/cupons', places.criarCupons)
routes.put('/eventos', places.updateEventos);
routes.put('/cupons', places.updateCupons);
routes.put('/promocoes', places.updatePromocao);
routes.post('/atualizar', places.updatePlaces);
routes.delete('/eventos/:eventoId', places.deleteEventos);
routes.delete('/cupons/:cupomId', places.deleteCupons);
routes.delete('/promocoes/:promocaoId', places.deletePromocao);
routes.delete('/deletar', places.deletarPlace);
routes.post('/responder/:id', places.respoderAvaliacao);

export default routes;

