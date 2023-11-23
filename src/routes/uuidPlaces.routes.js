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

routes.get('/avaliacoes', places.getAvaliacoes);
routes.get('/informacoes', places.showInfo);
routes.get('/eventos', places.getEventos);
routes.get('/promocao', places.getPromocao);
routes.get('/cupons', places.getCupons);

// so o usuario pode acessar
routes.use(verifyifUser);

routes.post('/denunciar', places.denunciarPlace);

// juntar avaliar e avaliacoes
routes.post('/avaliacoes', places.avaliarPlace);
// routes.get('/avaliacoes', places.getAvaliacoes)

routes.post('/avaliacoes/denunciar/:id', places.denunciarAvaliacao);
routes.post('/respotas/denunciar/:id', places.denunciarResposta);

// juntar favoritar e favorito
routes.post('/favorito', places.criarFavorito);
routes.get('/favorito', places.getFavorito);
routes.delete('/favorito', places.deletarFavorito);

export default routes;
