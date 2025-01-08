const express = require('express')
const router = express.Router();

const {verify} = require("../../middlewares/verify_midware");

const reportController = require("../../controllers/admin/report_controller")

router.get('/', verify, reportController.home)

module.exports = router