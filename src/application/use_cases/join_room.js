const { v4: uuidv4 } = require('uuid');
const Message = require('../../domain/models/message');

class JoinRoom {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(roomId, userId, username, ws) {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    room.users.set(userId, ws);
    const joinMessage = new Message(uuidv4(), 'system', 'System', `${username} has joined the room.`, new Date());
    
    // Retorna a sala e a mensagem para serem transmitidas
    return { room, messageToBroadcast: joinMessage };
  }
}

module.exports = JoinRoom;