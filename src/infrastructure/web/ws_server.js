const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

/**
 * Cria e configura o servidor WebSocket.
 * @param {http.Server} server - O servidor HTTP para acoplar o WebSocket.
 * @param {ChatService} chatService - O serviço de aplicação que contém a lógica de negócio do chat.
 */
function createWebSocketServer(server, chatService) {
  const wss = new WebSocket.Server({ server });

  /**
   * Transmite uma mensagem para todos os clientes conectados em uma sala.
   * @param {Room} room - A entidade da sala, contendo os usuários conectados.
   * @param {Message} message - A entidade da mensagem a ser enviada.
   * @param {string} [messageType='NEW_MESSAGE'] - O tipo de evento a ser enviado ao cliente.
   */
  function broadcastMessage(room, message, messageType = 'NEW_MESSAGE') {
    if (!room || !room.users) return;

    const payload = JSON.stringify({
      type: messageType,
      id: message.id,
      text: message.text,
      timestamp: message.timestamp,
      userId: message.userId,
      username: message.username,
      roomId: message.roomId,
    });

    for (const client of room.users.values()) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  wss.on('connection', (ws, req) => {
    let user;
    try {
      // 1. Autenticação na Conexão
      const token = req.url.split('token=')[1];
      if (!token) throw new Error('Token não fornecido');
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      ws.close(1008, 'Autenticação falhou');
      return;
    }

    // 2. Manipulador de Mensagens recebidas do cliente
    ws.on('message', async (message) => {
      const data = JSON.parse(message);
      
      try {
        switch (data.type) {
          case 'CREATE_ROOM': {
            const room = await chatService.createRoom(data.roomName);
            ws.send(JSON.stringify({ type: 'ROOM_CREATED', roomId: room.id, roomName: room.name }));
            break;
          }

          case 'JOIN_ROOM': {
            // A lógica de negócio retorna a sala, a mensagem de entrada e o histórico
            const { room, messageToBroadcast, previousMessages } = await chatService.joinRoom(data.roomId, user.id, user.username, ws);
            ws.roomId = room.id; // Associa a conexão WebSocket à sala
            
            // Envia o histórico de mensagens apenas para o usuário que entrou
            ws.send(JSON.stringify({ type: 'PREVIOUS_MESSAGES', messages: previousMessages }));
            
            // Notifica todos na sala sobre o novo membro
            broadcastMessage(room, messageToBroadcast);
            break;
          }

          case 'SEND_MESSAGE': {
            if (!ws.roomId) break; // Não pode enviar mensagem se não estiver em uma sala
            const { room, messageToBroadcast } = await chatService.sendMessage(ws.roomId, user.id, user.username, data.text);
            broadcastMessage(room, messageToBroadcast);
            break;
          }
        }
      } catch (error) {
        console.log('Erro ao processar mensagem:', error);
         ws.send(JSON.stringify({ type: 'ERROR', message: error.message }));
      }
    });

    // 3. Manipulador de Desconexão
    ws.on('close', async () => {
      if (ws.roomId) {
        const result = await chatService.leaveRoom(ws.roomId, user.id, user.username);
        if (result) {
          const { room, messageToBroadcast } = result;
          // Notifica os usuários restantes que alguém saiu
          broadcastMessage(room, messageToBroadcast);
        }
      }
    });
  });

  return wss;
}

module.exports = createWebSocketServer;
