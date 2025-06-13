require('dotenv').config();
const express = require('express');
// Servidores
const createExpressServer = require('./src/infrastructure/web/express_server');
const createWebSocketServer = require('./src/infrastructure/web/ws_server');

// Repositórios (Implementações Postgres)
// NOTA: No seu código, você usaria require para cada arquivo separado
const PostgresUserRepository = require('./src/infrastructure/persistence/postgres_user_repository');
const PostgresRoomRepository = require('./src/infrastructure/persistence/postgres_room_repository');
const PostgresMessageRepository = require('./src/infrastructure/persistence/postgres_message_repository');

// Serviços de Aplicação
const AuthService = require('./src/application/services/auth_service');
const ChatService = require('./src/application/services/chat_service');

// Rotas
const createAuthRoutes = require('./src/infrastructure/web/routes/auth_routes');

// --- Injeção de Dependência com Repositórios Postgres ---

// Assumindo que as classes do bloco anterior estão disponíveis
const userRepository = new PostgresUserRepository();
const roomRepository = new PostgresRoomRepository();
const messageRepository = new PostgresMessageRepository();

// Serviços
const authService = new AuthService(userRepository);
const chatService = new ChatService(roomRepository, messageRepository);

// --- Configuração e Inicialização ---

const app = createExpressServer();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const authRoutes = createAuthRoutes(authService);
app.use('/api/auth', authRoutes);

const server = app.listen(port, () => {
  console.log(`🚀 Servidor HTTP rodando na porta ${port}`);
});

createWebSocketServer(server, chatService);
console.log('🚀 Servidor WebSocket conectado e rodando.');
console.log('🐘 Conectado ao banco de dados Postgres (NeonDB).');

