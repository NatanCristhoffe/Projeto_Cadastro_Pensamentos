const express = require("express")
const exphbs = require("express-handlebars")
const session = require("express-session")
const fileStore = require("session-file-store")(session)
const flash = require("express-flash")

const app = express()

const conn = require("./db/conn")

//Models
const Tought = require("./models/Tought,")
const User = require("./models/user")

//Import Routers
const toughtsRoutes = require("./routes/toughtsRoutes")
const authRoutes = require("./routes/authRoutes")

//import controle
const ToughtsController = require("./controllers/ToughtController")


//Templates engine
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")

//receber resposta do body
app.use(express.urlencoded({extended:true}))

app.use(express.json())

//sesion middleware
app.use(
    session({
        name:"session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new fileStore ({
            logFn: function() {},
            path: require("path").join(require("os").tmpdir(), "session"),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true,
            }
        }),
)

//flash messages
app.use(flash())

//public path
app.use(express.static("public"))
//set session to res
app.use((req,res, next) =>{
    if (req.session.userid) {
        res.locals.session = req.session
    }
    next()
})

//Routes
app.use("/toughts", toughtsRoutes)
app.use("/", authRoutes)


app.get("/", ToughtsController.showToughts)

conn
    // .sync({force:true})
    .sync()
    .then(() => {app.listen(3000)})
    .catch((err) => console.log(`Erro: ${err}`))

