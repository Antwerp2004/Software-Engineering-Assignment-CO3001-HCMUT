const express = require('express')
const app = express()

app.use(express.static(`${__dirname}/public`))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

require('dotenv').config();
const port = process.env.PORT

// notification
const flash = require('express-flash')
const cookieParser = require('cookie-parser');
const session = require('express-session')
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end notification

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

const systemConfig = require("./configs/system.js")
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.pagination_item_per_page = systemConfig.pagination_item_per_page

app.get("/role", (req, res) => {
    res.render("index.pug");    
})
const userRoute = require("./routers/user/index_router.js")
const adminRoute = require("./routers/admin/index_router.js")
const allRouter = require("./routers/all/index_router.js")
userRoute(app)
adminRoute(app)
allRouter(app)

const blacklistDatabase = require("./configs/blacklist_database.js");
blacklistDatabase.connect();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// // connect to database
// const database = require("./configs/database.js");
// const connectDatabase = new Promise(async (resolve, reject) => {
//     try {
//         const client = await database.getClient();
//         resolve(client);
//     }
//     catch (err) {
//         reject(err);
//     }
// })
// connectDatabase.then((client) => {
//     module.exports.client = client;

//     // router
//     const route = require("./routers/index_router.js")
//     route(app)

//     app.listen(port, () => {
//         console.log(`Example app listening on port ${port}`)
//     })
// })

