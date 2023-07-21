import express from 'express';
import places from '../controllers/placeController.js';

const routes = express();

// verificar permissoes do usuario 
routes.get('/coisa', places.showInfo)

export default routes;


