const express = require('express')
const router = express.Router();

const {verify} = require("../../middlewares/verify_midware");

const logController = require("../../controllers/user/log_controller")

router.get('/', verify, logController.home)

module.exports = router