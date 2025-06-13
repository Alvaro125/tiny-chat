const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const User = require('../../domain/models/user');

class RegisterUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(username, password) {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(uuidv4(), username, hashedPassword);
    
    return this.userRepository.save(newUser);
  }
}

module.exports = RegisterUser;