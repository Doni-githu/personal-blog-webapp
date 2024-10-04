import { Router } from "express";
import auth from "../middlewares/auth.js"
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get("/home", (req, res) => {
    if (!fs.existsSync(path.join(__dirname, "..", "data", "articles.json"))) {
        res.render("home", {
            "title": "Home page"
        })
        return
    }
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "articles.json")))
    res.render("home", {
        title: "Home page",
        data: data
    })
})
router.get("/admin", auth, (req, res) => {
    res.render("admin", {
        title: "Admin page"
    })
})
router.get("/edit/:id", (req, res) => {
    res.render("edit", {
        title: "Edit page"
    })
})
router.get("/new", (req, res) => {
    res.render("new", {
        title: "New page",
        token: req.token
    })
})
router.get("/article/:id", (req, res) => {

    const id = parseInt(req.params.id)
    if (!fs.existsSync(path.join(__dirname, "..", "data", "articles.json"))) {
        res.redirect("/home")
        return
    }
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "articles.json")))
    const item = data.find((item) => parseInt(item.id) === id)
    if (!item) {
        res.render("home", {
            "title": "Home page",
            data
        })
        return
    }


    res.render("article", {
        title: "Home page",
        article: item
    })
})

router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
    })
})

router.post("/login", (req, res) => {
    const { username, password } = req.body

    if (username !== "admin" && password !== "admin") {
        res.status(400).json({ message: "Wrong Username or password" })
    }
    const token = jwt.sign({ username, password }, "null")

    res.redirect("/admin")
})

export default router