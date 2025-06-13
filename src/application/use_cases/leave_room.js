const { v4: uuidv4 } = require('uuid');
const Message = require('../../domain/models/message');

class LeaveRoom {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(roomId, userId, username) {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      // Se a sala não for encontrada, não há o que fazer.
      return null;
    }
    
    room.users.delete(userId);
    
    const leaveMessage = new Message(uuidv4(), 'system', 'System', `${username} has left the room.`, new Date());
    
    return { room, messageToBroadcast: leaveMessage };
  }
}

module.exports = LeaveRoom;