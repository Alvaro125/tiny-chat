class Message {
    constructor(id, userId, username, text, timestamp) {
      this.id = id;
      this.userId = userId;
      this.username = username;
      this.text = text;
      this.timestamp = timestamp;
    }
  }
  
  module.exports = Message;