//import express
const express = require('express')

//init express router
const router = express.Router();

//import verifyToken
const verifyToken = require('../middlewares/auth');

//import register controller
const registerController = require('../controllers/RegisterController');

//import login controller
const loginController = require('../controllers/loginController');

//import user controller
const userController = require('../controllers/userController');

//import member controller
const memberController = require('../controllers/memberController');

//import validate register and login
const { validateRegister, validateLogin } = require('../utils/validators/auth');

//import validate user
const { validateUser } = require('../utils/validators/user');

//import validate member
const { validateMember } = require('../utils/validators/member');
const { verify } = require('jsonwebtoken');

//define route for register
router.post('/register', validateRegister, registerController.register);

//define route for login
router.post('/login', validateLogin, loginController.login);

//define route for user
router.get('/admin/users', verifyToken, userController.findUsers);

//define route for user create
router.post('/admin/users', verifyToken, validateUser, userController.createUser);

//define route for user by id
router.get('/admin/users/:id', verifyToken, userController.findUserById);

//define update user 
router.put('/admin/users/:id', verifyToken, validateUser, userController.updateUser);

//define delete user
router.delete('/admin/users/:id', verifyToken, userController.deleteUser);

//define route for create member
router.post('/admin/members', verifyToken, validateMember, memberController.createMembers);

//define route for get member
router.get('/admin/members', verifyToken, memberController.getMembers);

//define route for member by name
router.get('/admin/members/:name', verifyToken, memberController.findMembersByName);

//define route for member details
router.get('/admin/members/:name', verifyToken, memberController.detailMembers);

//export router
module.exports = router