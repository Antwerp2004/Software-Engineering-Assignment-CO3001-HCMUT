const express = require('express')
const router = express.Router();

const {verify} = require("../../middlewares/verify_midware");

const profileController = require("../../controllers/user/profile_controller")

router.get('/', verify, profileController.home)

module.exports = router