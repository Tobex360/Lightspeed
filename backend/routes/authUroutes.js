const express = require('express');
const AuthUcontroller = require('../controllers/authUcontroller');
const authenticateToken = require('../middleware/authjwt')
const router = express.Router();


router.post('/uregister', AuthUcontroller.registerUser)
router.post('/ulogin', AuthUcontroller.loginUser)
router.put('/edit/:id', AuthUcontroller.editUser)


module.exports = router;
