import { Router } from "express";
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken"

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pathToArticles = path.join(__dirname, "..", "data", "articles.json")

router.get("/home", (req, res) => {
    if (req.cookies["token"]) {
        res.redirect("/admin")
    }
    if (!fs.existsSync(pathToArticles)) {
        res.render("home", {
            "title": "Home page",
            "data": [],
            isLogin: false
        })
        return
    }
    const data = JSON.parse(fs.readFileSync(pathToArticles))
    res.render("home", {
        title: "Home page",
        data: data,
        isLogin: false
    })
})
router.get("/admin", (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login")
    }
    if (!fs.existsSync(pathToArticles)) {
        fs.writeFileSync(pathToArticles, "[]")

    }
    const data = JSON.parse(fs.readFileSync(pathToArticles))
    console.log(data)
    res.render("admin", {
        title: "Admin page",
        data,
        isLogin: true
    })
})
router.get("/edit/:id", (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login")
    }

    const id = req.params.id

    const data = JSON.parse(fs.readFileSync(pathToArticles))
    const foundArticle = data.find((item) => parseInt(item.id) === parseInt(id))
    if (!foundArticle) {
        res.redirect("/admin")
        return
    }
    res.render("edit", {
        title: "Edit page",
        isLogin: true,
        item: foundArticle
    })
})


router.post("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const { title, content } = req.body

    const articles = JSON.parse(fs.readFileSync(pathToArticles))
    const newArticles = articles.map((article) => {
        if (parseInt(article.id) === id) {
            return {
                title: title ? title : article.title,
                id: id,
                publish_date: article.publish_date,
                content: content ? content : article.content
            }
        }
        return article
    })
    fs.writeFileSync(pathToArticles, JSON.stringify(newArticles))
    res.redirect("/admin")
})

router.post("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id)
    if (!req.cookies.token) {
        res.redirect("/login")
    }


    const articles = JSON.parse(fs.readFileSync(pathToArticles))

    const updatedArticles = articles.filter((item) => parseInt(item.id) !== id)
    fs.writeFileSync(pathToArticles, JSON.stringify(updatedArticles))

    res.redirect("/admin")
})

router.get("/new", (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login")
    }
    res.render("new", {
        title: "New page",
        token: req.token,
        isLogin: true
    })
})

router.post("/new", (req, res) => {
    console.log(req.body)
    if (!fs.existsSync(pathToArticles)) {
        fs.writeFileSync(path.join(__dirname, "..", "data", "articles.json"), "[]")
    }
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "articles.json")))
    const newArticle = {
        ...req.body,
        publish_date: new Date(),
        id: Date.now()
    }
    data.push(newArticle)
    const rest = JSON.stringify(data)
    fs.writeFileSync(path.join(__dirname, "..", "data", "articles.json"), rest)
    res.redirect("/home")
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
            data,
            isLogin: new Boolean(req.cookies.token)
        })
        return
    }


    res.render("article", {
        title: "Home page",
        article: item,
        isLogin: new Boolean(req.cookies.token)
    })
})

router.get("/login", (req, res) => {
    if (req.cookies.token) {
        res.redirect("/admin")
        return
    }
    res.render("login", {
        title: "Login",
    })
})

router.post("/login", (req, res) => {
    const { username, password } = req.body
    console.log()
    if (username !== "admin" && password !== "admin") {
        res.redirect("/login")
        return
    }
    const token = jwt.sign({ username, password }, "null")
    res.cookie("token", token, { httpOnly: true, secure: true })
    res.redirect("/admin")
})

router.get("/logout", (req, res) => {
    res.clearCookie("token")
    res.redirect("/home")
})

router.get("/", (req, res) => {
    if (req.cookies["token"]) {
        res.redirect("/admin")
        return
    }
    res.redirect("/home")
})

export default router