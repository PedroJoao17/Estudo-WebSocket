const http = require('http'); // Cria servidor HTTP
const fs = require('fs');     // Para ler arquivos (ex: index.html)
const path = require('path'); // Para manipular caminhos de forma segura
const WebSocket = require('ws'); // WebSocket nativo do Node.js via 'ws'

const PORT = process.env.PORT || 3000; // Usa porta do Railway ou localmente a 3000

// 🔧 Cria servidor HTTP para servir o index.html
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'index.html');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' }); // Melhorar cabeçalho de erro
            res.end('Erro ao carregar a página.');
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

// 🔌 Instancia WebSocket no mesmo servidor HTTP
const wss = new WebSocket.Server({ server });

console.log(`WebSocket configurado para a porta ${PORT}`);

// 🔄 Evento de nova conexão
wss.on('connection', socket => {
    console.log('🟢 Cliente conectado via WebSocket');

    // 📩 Evento de recebimento de mensagem
    socket.on('message', message => {
        console.log('📨 Mensagem recebida:', message.toString());

        // 🔁 Reenvia para todos os clientes conectados
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`ECO: ${message}`);
            }
        });
    });

    // ❌ Evento de desconexão
    socket.on('close', () => {
        console.log('🔴 Cliente desconectado');
    });
});

// 🚀 Inicia servidor HTTP (e WebSocket junto)
server.listen(PORT, () => {
    console.log(`🌐 Servidor rodando na ${PORT}`);
});
