import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import '../lab_7_arch/index.js'; 
import userRoutes from '../lab_7_arch/router/user.router.js';


import { initializeWebSocket, setupWebSocketServer } from './websocket.js';
import sessionConfig from './config/sessionConfig.js';


const app = express();
const port = 8080;

// __dirname для ES-модулів
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Підключення middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // твій фронтенд
  credentials: true // дозволити надсилати cookies
}));
app.use(express.json());
app.use(session(sessionConfig));


// Налаштування шаблонізатора
app.set('views', path.join(__dirname, '../src'));
app.set('view engine', 'pug');

// Статика або рендер у залежності від оточення
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/', (req, res) => {
    res.render('index', { user: req.session.user || null });
  });
} else {
  app.get('/', (req, res) => {
    res.render('index', { user: req.session.user || null });
  });
}

// Підключити роутинг
app.use('/api', userRoutes); 

// Створити сервер
const server = http.createServer(app);

// Запустити WebSocket сервер
setupWebSocketServer(server);

// Ініціалізувати WebSocket для Binance
initializeWebSocket();

// Стартувати сервер
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
