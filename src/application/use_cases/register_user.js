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
    const savedUser = await this.userRepository.save(newUser);
    console.log(`User registered: ${savedUser}`);
    if (!savedUser) {
      throw new Error('Failed to register user');
    }
    return  {
      id: savedUser.id,
      username: savedUser.username,
    };
  }
}

module.exports = RegisterUser;