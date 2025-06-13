const RegisterUser = require('../use_cases/register_user');
const LoginUser = require('../use_cases/login_user');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(username, password) {
    const registerUser = new RegisterUser(this.userRepository);
    console.log(`Registering user: ${registerUser}`);
    return registerUser.execute(username, password);
  }

  async login(username, password) {
    const loginUser = new LoginUser(this.userRepository);
    return loginUser.execute(username, password);
  }
}

module.exports = AuthService;