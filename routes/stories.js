const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Story = mongoose.model('stories')
const User = mongoose.model('users')
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth')

// Stories index
router.get('/', (req, res) => {
    Story.find({
        status: 'public'
    })
    .populate('user')
    .sort({date: 'desc'})
    .then(stories => {
        res.render('stories/index', {
            stories: stories
        })
    })
})

// Show Single Story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
        if(story.status == "public") {
            res.render('stories/show', {
                story: story
            })
        } else {
            // if logged in
            if(req.user) {
                if(req.user.id == story.user._id) {
                    res.render('stories/show', {
                        story: story
                    })
                } else {
                    res.redirect('/stories')
                }
            } else {
                res.redirect('/stories')
            }
        }
    })
})

// Add story form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add')
})

// Edit story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        if(story.user != req.user.id){
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story: story
            })
            
        }
    })
})

// Edit Form Process
router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        let allowComments = false

        if(req.body.allowComments) allowComments = true

        // New Values
        story.title = req.body.title,
        story.body = req.body.body,
        story.status = req.body.status,
        story.allowComments = allowComments

        story.save()
        .then(story => {
            res.redirect('/dashboard')
        })
    })
})

router.delete('/:id', (req, res) => {
    Story.remove({
        _id: req.params.id
    })
    .then( () => {
        res.redirect('/dashboard')
    }) 
})

// Process Add Story
router.post('/', (req, res) => {
    let allowComments = false

    if(req.body.allowComments) allowComments = true

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        // Get the logged in user's id
        user: req.user.id
    }

    // Create Story
    new Story(newStory)
    .save()
    .then(story => {
        res.redirect(`/stories/show/${story._id}`)
    })
    .catch(err => console.log(`error: ${err}`))
})

// Add comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }

        // Add to comments array
        story.comments.unshift(newComment)

        story.save()
        .then( story => {
            res.redirect(`/stories/show/${story.id}`)
        })
    })
})

module.exports = router