const { v4: uuidv4 } = require('uuid');
const Room = require('../../domain/models/room');

class CreateRoom {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(roomName) {
    let room = await this.roomRepository.findByName(roomName);
    if (!room) {
      room = new Room(uuidv4(), roomName);
      await this.roomRepository.save(room);
    }
    return room;
  }
}

module.exports = CreateRoom;