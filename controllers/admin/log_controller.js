const userModel = require("../../models/user_model.js")
const {pagination_item_per_page} = require("../../configs/system.js");

// [GET] /admin/log
module.exports.home = async (req, res) => {
    let page;
    if (req.query.page) page = req.query.page
    else page = 1;

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const printerID = req.query.printerID;
    const studentID = req.query.studentID;

    const logs = await userModel.getLogAdmin(page, startDate, endDate, printerID, studentID);

    const totalLog = await userModel.getTotalLogAdmin(startDate, endDate, printerID, studentID);

    res.render("./admin/pages/log.pug", {
        page: page,
        totalLog: totalLog,
        logs: logs
    })
}

// [GET] /admin/log/filter
module.exports.filter = async (req, res) => {
    const printerLocation = await userModel.getAllPrinterLocation();
    res.render("./admin/pages/log_filter.pug", {
        printerLocation: printerLocation
    })
}