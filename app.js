const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')

// Map global promises
mongoose.Promise = global.Promise

// Load Models
require('./models/User')
require('./models/Story')

// Passport Config
require('./config/passport')(passport)

// Load Routes
const index = require('./routes/index')
const auth = require('./routes/auth')
const stories = require('./routes/stories')

// Load Keys
const keys = require('./config/keys')

// Load Handlebars helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs')

// Connect MongoDB
mongoose.connect(keys.mongoURI)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))

const app = express()

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))


// -----MIDDLEWARE----- //
// Handlebars middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
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

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'))

// Global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

// Use Routes
app.use('/', index)
app.use('/auth', auth)
app.use('/stories', stories)

// -----MIDDLEWARE END----- //

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
