const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user')


router.post('/api/user/signup', userControllers.createUser);

router.post('/api/user/login', userControllers.login)

module.exports = router;
