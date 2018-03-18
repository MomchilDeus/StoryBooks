const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Story = mongoose.model('stories')
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth')

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome')
})

// Dashboard route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Story.find({
        user: req.user.id
    })
    .then( stories => {
        res.render('index/dashboard', {
            stories: stories
        })
    })
})

// About route
router.get('/about', (req, res) => {
    res.render('index/about')
})

// Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

module.exports = router