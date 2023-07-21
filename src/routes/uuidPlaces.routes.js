import express from 'express';
import places from '../controllers/placeController.js';

const routes = express();

routes.get('/coisa', places.showInfo)

export default routes;