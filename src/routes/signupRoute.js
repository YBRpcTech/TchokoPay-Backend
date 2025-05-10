const express = require('express');
const { signup } = require('../Controllers/SignUpController');
const router = express.Router();

router.post('/signup', signup);

module.exports = router;
