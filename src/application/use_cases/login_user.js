const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(username, password) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { token };
  }
}

module.exports = LoginUser;