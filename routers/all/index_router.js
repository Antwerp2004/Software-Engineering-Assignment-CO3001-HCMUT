const logoutRouter = require("./logout_router.js")

module.exports = (app) => {
    app.use('/logout', logoutRouter);
}