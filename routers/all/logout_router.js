const express = require('express')
const router = express.Router();

const logoutController = require("../../controllers/all/logout_controller")

router.post('/', logoutController.logout)

module.exports = router