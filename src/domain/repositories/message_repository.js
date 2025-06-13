class MessageRepository {
    async save(message, roomId, userId, username) {
        throw new Error("Method 'save()' must be implemented.");
    }
    async findByRoomId(roomId) {
        throw new Error("Method 'findByRoomId()' must be implemented.");
    }
}
module.exports = MessageRepository;