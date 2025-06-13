const RoomRepository = require('../../domain/repositories/room_repository');
const Room = require('../../domain/models/room');
const db = require('./neondb');

class PostgresRoomRepository extends RoomRepository {
  constructor() {
      super();
      this.activeRooms = new Map(); // Cache em memória para salas em uso
  }

  /**
   * Carrega uma sala do banco para o cache em memória, se ainda não estiver lá.
   * @private
   */
  _loadRoomToCache(roomData) {
      if (!this.activeRooms.has(roomData.id)) {
        const roomInstance = new Room(roomData.id, roomData.name);
        this.activeRooms.set(roomData.id, roomInstance);
      }
      return this.activeRooms.get(roomData.id);
  }

  /** @override */
  async save(room) {
    const { id, name } = room;
    // Tenta inserir; se o nome já existir (UNIQUE), não faz nada.
    const query = 'INSERT INTO rooms (id, name) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING';
    await db.query(query, [id, name]);
    
    // Após garantir que existe no DB, retorna a versão do cache/carrega para o cache
    const roomData = await this.findByName(name);
    return roomData;
  }

  /** @override */
  async findById(id) {
    // Primeiro, verifica o cache
    if (this.activeRooms.has(id)) {
        return this.activeRooms.get(id);
    }
    
    // Se não estiver no cache, busca no banco
    const query = 'SELECT * FROM rooms WHERE id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }
    
    return this._loadRoomToCache(result.rows[0]);
  }

  /** @override */
  async findByName(name) {
    const query = 'SELECT * FROM rooms WHERE name = $1';
    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
      return null;
    }
    
    return this._loadRoomToCache(result.rows[0]);
  }

  /** @override */
  async list() {
      const query = 'SELECT * FROM rooms ORDER BY created_at DESC';
      const result = await db.query(query);
      return result.rows.map(row => new Room(row.id, row.name));
  }
}

module.exports = PostgresRoomRepository;