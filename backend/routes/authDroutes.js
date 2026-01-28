const express =require('express');
const AuthDcontroller = require('../controllers/authDcontroller');
const router = express.Router();


router.post('/dregister', AuthDcontroller.registerDriver);
router.post('/dlogin', AuthDcontroller.loginDriver);
router.put('/edit/:id', AuthDcontroller.editDriver);
router.get('/available', AuthDcontroller.getDrivers)



module.exports = router;