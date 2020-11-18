const createError = require('http-errors');
const express = require('express');
const expressSession = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
const dotenv = require('dotenv');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    port: process.env.SQL_PORT,
    database: process.env.SQL_DATABASE1,
    database: process.env.SQL_DATABASE2
        // host: '34.122.173.145',
        // user: 'root',
        // password: '12345678',
        // port: '8080'
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL database connected...");
    }
});

const publicDirectory = path.join(__dirname, './public', './routes');
app.use(express.static(publicDirectory));

app.set('view-engine', 'pug');

app.get("/", (req, res) => {
    // res.send("<h1>Home Page</h1>")
    res.render("index.pug"); // fusionauth/bin/startup.bat -> fusionauth
});

app.listen(5001, () => {
    console.log("Server started on Port 5001");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ resave: false, saveUninitialized: false, secret: 'api' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;