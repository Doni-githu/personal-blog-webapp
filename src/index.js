import express from "express"
import { create } from "express-handlebars"
import article from "./routes/article.js"
import { fileURLToPath } from "url"
import { dirname } from "path"
import flash from "connect-flash"
import session from "express-session"
import cookieParser from "cookie-parser"
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const hbs = create({ extname: "hbs", defaultLayout: "main" })

app.engine("hbs", hbs.engine)
app.set("view engine", "hbs")
app.set("views", "./src/views")
app.use(express.static("./src/public"))
app.use(express.urlencoded({
    extended: true
}))
app.use(article)
app.use(flash())
app.use(session({ name: "Donni", resave: false, saveUninitialized: false, secret: "Donni" }))
app.use(cookieParser())

const startApp = () => {
    const port = process.env.PORT || 8000
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
}

startApp()