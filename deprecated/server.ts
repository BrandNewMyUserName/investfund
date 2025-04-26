import express, { Request, Response } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const app = express();
const port = 8080;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Set up WebSocket server
const wss = new WebSocketServer({ server });

// List of cryptocurrencies
const symbols: string[] = [
  'btcusdt',
  'bnbusdt',
  'ethusdt',
  'bchusdt',
  'xrpusdt',
  'eosusdt',
  'ltcusdt',
  'trxusdt',
  'etcusdt',
  'linkusdt',
];

const streams = symbols.map((symbol) => `${symbol}@miniTicker`).join('/');
const wsUrl = `wss://fstream.binance.com/stream?streams=${streams}`;
const binanceWs = new WebSocket(wsUrl);

// Type for Binance message
interface BinanceMessage {
  stream: string;
  data: {
    s: string; // symbol
    c: string; // close price
    o: string; // open price
    q: string; // volume
  };
}

binanceWs.on('open', () => {
  console.log('Connected to Binance Futures WebSocket');
});

binanceWs.on('message', (data: WebSocket.RawData) => {
  const message: BinanceMessage = JSON.parse(data.toString());
  const { s: symbol, c: closePrice, o: openPrice, q: volume } = message.data;

  // Broadcast to all connected browser clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          symbol,
          closePrice,
          openPrice,
          volume,
        })
      );
    }
  });
});

binanceWs.on('error', (error: Error) => {
  console.error(`Binance WebSocket error: ${error.message}`);
});

binanceWs.on('close', () => {
  console.log('Binance WebSocket connection closed');
});

// Handle browser WebSocket connections
wss.on('connection', (ws: WebSocket) => {
  console.log('Browser client connected');
  ws.on('close', () => {
    console.log('Browser client disconnected');
  });
});
