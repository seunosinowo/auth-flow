const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const {users} = require("./database")

passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
    try{
        const user = await users.findOne({email})

        if(!user){
            return done(null, false, {error: "Incorrect email or password"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return done(null, false, {error: "Incorrect email or password"} )
        }
        done(null, user)

    }catch(error){
        done(error)
    }
}))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const user = await user.findOne({googleId: profile.id})
        const existingUser = await users.findOne({googleId: profile.id})

        if(user){
            return done (null, user)
        }

        const newUser = await users.insert({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        })

        done(null, newUser)
    }catch(error){
        done(error)
    }
}))



//When a user successfully login
passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (userId, done) => {
    try{
        const user = await users.findOne({_id: userId})
        if(!user){
            return done(new Error('User not Found'))
        }
        done(null, user)
    }catch(error){

    }
})