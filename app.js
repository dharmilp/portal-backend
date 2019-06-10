const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);

const app = express();
require('dotenv').config()

require('./config/passport')(passport);

//const db = require('./config/keys').MongoURI;
const db = "mongodb://localhost/default";
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MongoDb connected'))
.catch(err => console.log(err));

mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(express.urlencoded({ extended: true }));//false

// static files
app.use( express.static( "public" ) );

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));



app.use(passport.initialize());
app.use(passport.session());    

app.use(flash());

app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.session = req.session;
    next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/groups',require('./routes/groups'));
app.use('/quiz',require('./routes/quiz'));
app.use('/categories',require('./routes/category'));
app.use('/attempt',require('./routes/attemptQuiz'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on Port ${PORT}`));