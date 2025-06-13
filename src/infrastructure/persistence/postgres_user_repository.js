const UserRepository = require('../../domain/repositories/user_repository');
const User = require('../../domain/models/user');
const db = require('./neondb');

class PostgresUserRepository extends UserRepository {
  /** @override */
  async save(user) {
    const { id, username, password } = user;
    const query = 'INSERT INTO users (id, username, password_hash) VALUES ($1, $2, $3) RETURNING id, username, password_hash';
    const values = [id, username, password];
    
    const result = await db.query(query, values);
    const row = result.rows[0];
    
    return new User(row.id, row.username, row.password_hash);
  }

  /** @override */
  async findByUsername(username) {
    const query = 'SELECT id, username, password_hash FROM users WHERE username = $1';
    const result = await db.query(query, [username]);

    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return new User(row.id, row.username, row.password_hash);
  }

  /** @override */
  async findById(id) {
    const query = 'SELECT id, username, password_hash FROM users WHERE id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new User(row.id, row.username, row.password_hash);
  }
}

module.exports = PostgresUserRepository;