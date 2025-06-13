const express = require('express');

function createAuthRoutes(authService) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(`Registering user: ${username}`);
      const user = await authService.register(username, password);
      console.log(`User registered: ${user}`);
      res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });

  return router;
}

module.exports = createAuthRoutes;