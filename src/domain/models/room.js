class Room {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.users = new Map(); // Map<userId, ws>
        this.messages = [];
    }
}

module.exports = Room;