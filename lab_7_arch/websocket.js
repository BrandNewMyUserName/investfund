const { WebSocketServer, WebSocket } = require('ws');

let wss;

function setupWebSocketServer(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Browser client connected');
    ws.on('close', () => {
      console.log('Browser client disconnected');
    });
  });
}

async function fetchSymbols() {
  try {
    const response = await fetch('http://localhost:5000/api/instrument');
    const instruments = await response.json();
    return instruments.map(instrument => instrument.symbol);
  } catch (error) {
    console.error('Error fetching symbols:', error);
    return ['btcusdt', 'ethusdt', 'bnbusdt'];
  }
}

async function initializeWebSocket() {
  const symbols = await fetchSymbols();
  const streams = symbols.map((symbol) => `${symbol}@miniTicker`).join('/');
  const wsUrl = `wss://fstream.binance.com/stream?streams=${streams}`;
  const binanceWs = new WebSocket(wsUrl);

  binanceWs.on('open', () => {
    console.log('Connected to Binance Futures WebSocket');
  });

  binanceWs.on('message', (data) => {
    const message = JSON.parse(data.toString());
    const { s: symbol, c: closePrice, o: openPrice, q: volume } = message.data;

    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ symbol, closePrice, openPrice, volume }));
        }
      });
    }
  });

  binanceWs.on('error', (error) => {
    console.error(`Binance WebSocket error: ${error.message}`);
  });

  binanceWs.on('close', () => {
    console.log('Binance WebSocket connection closed');
  });
}

module.exports = {
  setupWebSocketServer,
  initializeWebSocket
};
