//import express
const express = require('express')

//init express router
const router = express.Router();

// import verifyToken
const verifyToken = require('../middlewares/auth')

//import register controller
const registerController = require('../controllers/registerController');

// import login controller 
const loginController = require('../controllers/loginController');

// import users conroller 
const usersController = require('../controllers/userController');

//import validate register and login
const { validateRegister, validateLogin } = require('../utils/validators/auth');

//define route for register 
router.post('/register', validateRegister, registerController.register);

// define route for login 
router.post('/login', validateLogin, loginController.login);

// define route for users 
router.get('/admin/users', verifyToken, usersController.findUsers);

//export router
module.exports = router