// server.js
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(__dirname));

wss.on('connection', (ws) => {
  console.log('[server] WebSocket connected');
  ws.on('message', (msg) => {
    console.log('[server] Received:', msg.toString());
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) client.send(msg.toString());
    });
  });
});

server.listen(5001, () => {
  console.log('READY'); // <-- Electron이 이걸 기다림
});
