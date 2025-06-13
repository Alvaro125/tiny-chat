const Room = require('../models/room');

class RoomRepository {
  /**
   * Salva ou atualiza uma sala.
   * @param {Room} room - A entidade de sala.
   * @returns {Promise<Room>} A entidade de sala salva.
   */
  async save(room) {
    throw new Error("Method 'save()' must be implemented.");
  }

  /**
   * Encontra uma sala pelo seu ID.
   * @param {string} id
   * @returns {Promise<Room|null>} A entidade de sala ou nulo se não for encontrada.
   */
  async findById(id) {
    throw new Error("Method 'findById()' must be implemented.");
  }
  
  /**
   * Encontra uma sala pelo seu nome.
   * @param {string} name
   * @returns {Promise<Room|null>} A entidade de sala ou nulo se não for encontrada.
   */
  async findByName(name) {
    throw new Error("Method 'findByName()' must be implemented.");
  }

  /**
   * Lista todas as salas.
   * @returns {Promise<Room[]>} Uma lista de todas as salas.
   */
  async list() {
    throw new Error("Method 'list()' must be implemented.");
  }
}

module.exports = RoomRepository;