const userModel = require("../../models/user_model.js")
const {prefixAdmin} = require("../../configs/system.js")

// [GET] /admin/mng_printer
module.exports.home = async (req, res) => {
    const listLocation = await userModel.getPrinterAdmin();

    res.render("./admin/pages/mng_printer.pug", {
        listLocation: listLocation
    })
}

// [PATCH] /admin/mng_printer/update_status/:id/:status
module.exports.modifyPrinter = async (req, res) => {
    let status = req.params.status;
    const id = req.params.id;

    if (status != "Đang hoạt động") status = "Đang hoạt động"
    else status = "Bảo trì";

    await userModel.modifyStatusPrinter(id, status);

    res.redirect(`${prefixAdmin}/mng_printer`);
}