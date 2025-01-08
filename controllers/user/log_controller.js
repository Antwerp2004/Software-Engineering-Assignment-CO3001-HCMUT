const userModel = require("../../models/user_model.js")

// [GET] /log
module.exports.home = async (req, res) => {
    const userID = req.user;
    const remainingPaper = await userModel.getRemainingPaper(userID);

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    let printerID = req.query.printerID;
    if (!printerID) printerID = ''

    console.log(startDate);
    const logs = await userModel.filterLog(startDate, endDate, printerID, userID);

    res.render("./user/pages/log.pug", {
        remainingPaper: remainingPaper,
        logs: logs,
        startDate: startDate,
        endDate: endDate,
        printerID: printerID
    })
}