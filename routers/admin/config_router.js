const express = require('express')
const router = express.Router();

const {verify} = require("../../middlewares/verify_midware");

const configController = require("../../controllers/admin/config_controller")

router.get('/', verify, configController.home)
router.post('/', configController.updateConfig)

module.exports = router