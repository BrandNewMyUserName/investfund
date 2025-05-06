const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { initializeWebSocket, setupWebSocketServer } = require('./websocket.js');
// const sessionConfig = require('./sessionConfig.js');

const app = express();

const port = 5000;

const sessionsDir = '../lab_7_arch/sessions'; // TODO
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir);
}

// Convert all data to json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Enable CORS with credentials if frontend is on a different domain
app.use(cors({
  origin: 'http://localhost:3000', // Adjust to your frontend URL
  credentials: true
}));

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      path: './sessions',
      logFn: console.error, 
      retries: 3, // Retry on file access errors
      ttl: 24 * 60 * 60, // 1 day TTL
      fileExtension: '.json'
    }),
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      sameSite: 'lax' // Helps with cross-origin requests
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