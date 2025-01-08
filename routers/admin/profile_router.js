const express = require('express')
const router = express.Router();

const {verify} = require("../../middlewares/verify_midware");

const profileController = require("../../controllers/admin/profile_controller")

router.get('/', verify, profileController.home)

module.exports = router