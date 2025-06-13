const MessageRepository = require('../../domain/repositories/message_repository');
const Message = require('../../domain/models/message');
const db = require('./neondb');


class PostgresMessageRepository extends MessageRepository {
    /** @override */
    async save(message) {
        const { id, text, timestamp, userId, username, roomId } = message;
        const query = `
            INSERT INTO messages (id, text, "timestamp", user_id, username, room_id) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;
        const values = [id, text, timestamp, userId, username, roomId];
        
        const result = await db.query(query, values);
        const row = result.rows[0];
        
        return new Message(row.id, row.text, new Date(row.timestamp), row.user_id, row.username, row.room_id);
    }

    /** @override */
    async findByRoomId(roomId) {
        const query = 'SELECT * FROM messages WHERE room_id = $1 ORDER BY "timestamp" ASC LIMIT 100'; // Limita para evitar sobrecarga
        const result = await db.query(query, [roomId]);
        
        return result.rows.map(row => 
            new Message(row.id, row.text, new Date(row.timestamp), row.user_id, row.username, row.room_id)
        );
    }
}

module.exports = PostgresMessageRepository;
