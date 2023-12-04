import express from 'express';
import { initialize } from './srcs/socket/socket';
import cors from 'cors';

const app = express();

// Activer la gestion des CORS pour toutes les routes
app.use(cors());

// Autres middlewares et routes ici...

function main() {
  initialize();
}

main();