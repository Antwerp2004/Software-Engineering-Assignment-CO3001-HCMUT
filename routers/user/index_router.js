const homeRouter = require("./home_router.js");
const buyPaerRouter = require("./buy_paper_router.js")
const logRouter = require("./log_router")
const loginRouter = require("./login_router.js")
const printRouter = require("./print-router.js")
const profileRouter = require("./profile_router.js")

module.exports = (app) => {
    app.use('/', homeRouter);
    app.use('/buy_paper', buyPaerRouter)
    app.use('/log', logRouter)
    app.use('/login', loginRouter)
    app.use('/print', printRouter)
    app.use('/profile', profileRouter)
}