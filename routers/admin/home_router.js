const express = require('express')
const router = express.Router();

const {verify} = require("../../middlewares/verify_midware");

const homeController = require("../../controllers/admin/home_controller")

router.get('/', verify, homeController.home)

module.exports = router