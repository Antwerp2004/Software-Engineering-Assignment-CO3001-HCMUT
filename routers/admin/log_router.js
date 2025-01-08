const express = require('express')
const router = express.Router();

const {verify} = require("../../middlewares/verify_midware.js")

const logController = require("../../controllers/admin/log_controller")

router.get('/', verify, logController.home)
router.get('/filter', verify, logController.filter)

module.exports = router