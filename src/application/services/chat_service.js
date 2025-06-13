const CreateRoom = require('../use_cases/create_room');
const JoinRoom = require('../use_cases/join_room');
const SendMessage = require('../use_cases/send_message');
const LeaveRoom = require('../use_cases/leave_room');

/**
 * Orquestra os casos de uso relacionados ao chat.
 */
class ChatService {
  constructor(roomRepository, messageRepository) {
    this.roomRepository = roomRepository;
    this.messageRepository = messageRepository;
  }

  async createRoom(roomName) {
    const createRoomUC = new CreateRoom(this.roomRepository);
    return createRoomUC.execute(roomName);
  }

  async joinRoom(roomId, userId, username, ws) {
    const joinRoomUC = new JoinRoom(this.roomRepository, this.messageRepository);
    return joinRoomUC.execute(roomId, userId, username, ws);
  }

  async sendMessage(roomId, userId, username, text) {
    const sendMessageUC = new SendMessage(this.roomRepository, this.messageRepository);
    return sendMessageUC.execute(roomId, userId, username, text);
  }
  
  async leaveRoom(roomId, userId, username) {
    const leaveRoomUC = new LeaveRoom(this.roomRepository);
    return leaveRoomUC.execute(roomId, userId, username);
  }
}

module.exports = ChatService;
