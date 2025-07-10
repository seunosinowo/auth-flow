const express = require("express")
const session = require("express-session")
const passport = require("passport")
const bcrypt = require("bcrypt")

const app = express()

app.use(express.json())

app.use(session({
    secret: "my-session-secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.listen(3000, (req, res) => {
    console.log("Server started on port 3000")
})