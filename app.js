const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')

// Map global promises
mongoose.Promise = global.Promise

// Load User Model
require('./models/User')

// Passport Config
require('./config/passport')(passport)

// Load Routes
const auth = require('./routes/auth')
const index = require('./routes/index')

// Load Keys
const keys = require('./config/keys')

// Connect MongoDB
mongoose.connect(keys.mongoURI)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))

const app = express()

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')


// Cookie parser middleware
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

// Use Routes
app.use('/auth', auth)
app.use('/', index)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
