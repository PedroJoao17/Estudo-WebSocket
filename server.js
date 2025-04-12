const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Cria um servidor HTTP simples para servir o index.html
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'index.html');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Erro ao carregar a página.');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

// WebSocket usando o mesmo servidor HTTP
const wss = new WebSocket.Server({ server });

console.log('Servidor WebSocket escutando na porta 8080');

wss.on('connection', socket => {
  console.log('Cliente conectado');

  socket.on('message', message => {
    console.log('Mensagem recebida:', message);

    // Envia para todos os clientes conectados
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`ECO: ${message}`);
      }
    });
  });

  socket.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Inicia o servidor na porta 8080
server.listen(8080, () => {
  console.log('Servidor HTTP disponível em http://localhost:8080');
});
