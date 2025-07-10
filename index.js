const express = require("express")
const session = require("express-session")
const passport = require("passport")
const bcrypt = require("bcrypt")

//importing users from DB
const {users} = require("./services/database")

const app = express()

app.use(express.json())

app.use(session({
    secret: "my-session-secret",
    resave: false,
    saveUninitialized: false
}))

//reg users
app.post("/register", async (req, res) => {
    const {name, email, password} = req.body

    try{
        if (!name || !email || !password){
            return res.status(422).json({error: "name, email, password are required"})
        }
        if (await users.findOne({email})){
            return res.status(409).json({error: "Email already in use"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await users.insert({
            name, 
            email,
            password: hashedPassword
        })

        res.status(201).json({id: newUser._id, name: newUser.name, email: newUser.email})

    }catch(error){
        res.status(500).json({error: "Something went wrong"})
        console.error("Registration error:", error)
    }
})



app.use(passport.initialize())
app.use(passport.session())

app.listen(3000, (req, res) => {
    console.log("Server started on port 3000")
})