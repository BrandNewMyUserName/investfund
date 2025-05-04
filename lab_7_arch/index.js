const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const http = require('http');
require('./index.js');
const { initializeWebSocket, setupWebSocketServer } = require('./websocket.js');
// const sessionConfig = require('./sessionConfig.js');

const app = express();

const port = 5000;
// Convert all data to json
app.use(express.json());
app.use(express.static('.'));

app.use(
  session({
    secret: 'your-secret-key', // Замініть на унікальний секретний ключ
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // У продакшені встановіть true з HTTPS
      maxAge: 24 * 60 * 60 * 1000 // Час життя cookie (наприклад, 1 день)
    }
  })
);

app.set('view engine', 'pug');
app.set('pages', path.join(__dirname, '../src/pages'));

app.get('/', (req, res) => {
  res.render('index', { user: req.session.user || null });
});

const server = http.createServer(app)

const InstrumentRouter = require('./router/instrument.router.js');
app.use('/api/instrument', InstrumentRouter);

const UserRouter = require('./router/user.router.js');
app.use('/api/user', UserRouter);

const PortfolioRouter = require('./router/portfolio.router.js');
app.use('/api/portfolio', PortfolioRouter);

const NewsRouter = require('./router/news.router.js');
app.use('/api/news', NewsRouter);

const PurchasedAssetRouter = require('./router/purchased_asset.router.js');
app.use('/api/purchased_asset', PurchasedAssetRouter);

setupWebSocketServer(server);

initializeWebSocket();

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});