const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect('/dashboard')
})

router.get('/verify', (req, res) => {
    // if we are authenticated we should have access to req.user
    if(req.user) {
        console.log(`The user is: ${req.user}`)
    } else {
        console.log('Not Authenticated')
    }
})

module.exports = router