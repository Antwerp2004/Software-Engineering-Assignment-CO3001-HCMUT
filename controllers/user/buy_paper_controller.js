const userModel = require("../../models/user_model.js")

// [GET] /buy_paper
module.exports.home = async (req, res) => {
    const userID = req.user;
    const logs = await userModel.logPayment(userID)
    res.render("./user/pages/buy_paper.pug", {
        logs: logs
    })
}

// [POST] /buy_paper
module.exports.updateBuyLog = async (req, res) => {
    const userID = req.user;
    const quantity = req.body.quantity;
    const pageType = 'A4'
    const status = 'Đã thanh toán'

    await userModel.updateRemainingPaperBuyPaper(userID, pageType, quantity);

    await userModel.updateBuyLog(userID, pageType, quantity, quantity * 1000, status)

    res.redirect("/buy_paper");
}