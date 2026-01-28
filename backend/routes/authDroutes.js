const express =require('express');
const AuthDcontroller = require('../controllers/authDcontroller');
const authenticateToken = require('../middleware/authjwt')
const router = express.Router();


router.post('/dregister', AuthDcontroller.registerDriver);
router.post('/dlogin', AuthDcontroller.loginDriver);
router.put('/edit/:id', AuthDcontroller.editDriver)



module.exports = router;