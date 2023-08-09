import express from 'express';
import places from '../controllers/placeController.js';
import {verifyifUser} from '../middlewares/loginType.js'

const routes = express();

// /avaliar
// /avaliacoes
// /cupons
// /favoritar
// /checkin or checkout
// /eventos
// /banner
// /fotos
// /perfil - famoso pegar todas as imfomações

// so o usuario pode acessar
routes.use(verifyifUser)

routes.get('/coisa', places.showInfo)
routes.post('/avaliar', places.avaliarPlace)
routes.get('/avaliacoes', places.getAvaliacoes)
routes.post('/favoritar', places.criarFavorito)
routes.get('/eventos', places.getEventos)
routes.get('/promocao', places.getPromocao)
routes.get('/cupons', places.getCupons) 
routes.get('/informacoes', places.getInformacoesPlace)


export default routes;
