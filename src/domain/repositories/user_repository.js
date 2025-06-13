const User = require('../models/user');

class UserRepository {
  /**
   * Salva ou atualiza um usuário.
   * @param {User} user - A entidade de usuário.
   * @returns {Promise<User>} A entidade de usuário salva.
   */
  async save(user) {
    throw new Error("Method 'save()' must be implemented.");
  }

  /**
   * Encontra um usuário pelo seu nome de usuário.
   * @param {string} username
   * @returns {Promise<User|null>} A entidade de usuário ou nulo se não for encontrada.
   */
  async findByUsername(username) {
    throw new Error("Method 'findByUsername()' must be implemented.");
  }

  /**
   * Encontra um usuário pelo seu ID.
   * @param {string} id
   * @returns {Promise<User|null>} A entidade de usuário ou nulo se não for encontrada.
   */
  async findById(id) {
    throw new Error("Method 'findById()' must be implemented.");
  }
}

module.exports = UserRepository;