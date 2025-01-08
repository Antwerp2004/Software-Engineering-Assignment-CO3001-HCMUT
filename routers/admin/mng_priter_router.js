const express = require('express')
const router = express.Router();

const {verify} = require("../../middlewares/verify_midware");

const mngPrinterController = require("../../controllers/admin/mng_printer_controller")

router.get('/', verify, mngPrinterController.home)
router.patch('/update_status/:id/:status', verify, mngPrinterController.modifyPrinter)

module.exports = router