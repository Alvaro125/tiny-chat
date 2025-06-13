const { v4: uuidv4 } = require('uuid');
const Message = require('../../domain/models/message');

class SendMessage {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }

    async execute(roomId, userId, username, text) {
        const room = await this.roomRepository.findById(roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        const chatMessage = new Message(uuidv4(), userId, username, text, new Date());
        room.messages.push(chatMessage);

        return { room, messageToBroadcast: chatMessage };
    }
}

module.exports = SendMessage;