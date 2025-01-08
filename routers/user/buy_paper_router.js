const express = require('express')
const router = express.Router();

const {verify} = require("../../middlewares/verify_midware");

const buyPaperController = require("../../controllers/user/buy_paper_controller")

router.get('/', verify, buyPaperController.home)
router.post('/', verify, buyPaperController.updateBuyLog)

module.exports = router