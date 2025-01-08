// [GET] /admin
module.exports.home = async (req, res) => {
    res.render("./admin/pages/home.pug")
}