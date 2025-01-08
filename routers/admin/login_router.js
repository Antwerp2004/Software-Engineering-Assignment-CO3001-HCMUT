const express = require('express')
const router = express.Router();

const loginController = require("../../controllers/admin/login_controller")

router.get('/', loginController.home)
router.post('/', loginController.verify);

module.exports = router