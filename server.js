const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const handleRegister = require('./controllers/register');
const handleSignin = require('./controllers/signin');
const handleImage = require('./controllers/image');
const handleProfile = require('./controllers/profile');
const handleForgotPassword = require('./controllers/password');
const handleFiles = require('./controllers/files');

var knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
});




app.use(express.json());//middleware

app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.post('/signin', (req, res) => {
    handleSignin.handleSignin(req, res, bcrypt, knex)

})


app.post('/filesupload', (req, res, next) => {

    handleFiles.handleFilesUpload(req, res, next)

})
app.post('/filesdownload', (req, res) => {
    handleFiles.handleFilesDownload(req, res)

})
app.post('/forgotpassword', (req, res) => {
    handleForgotPassword.handleForgotPassword(req, res, bcrypt, knex);
})

app.post('/renewpassword', (req, res) => {
    handleForgotPassword.handleRenewPassword(req, res, bcrypt, knex);
})

app.post('/register', (req, res) => {
    handleRegister.handleRegister(req, res, bcrypt, knex);
})


app.put('/profile', (req, res) => {
    handleProfile.handleProfile(req, res, knex, bcrypt)

})

app.put('/image', (req, res) => {
    handleImage.handleImage(req, res, knex)
})
app.put('/clarifai', (req, res) => {
    handleImage.clarifai(req, res)
})


app.listen(process.env.PORT, () => {
    console.log(`running on port ${process.env.PORT}`);
});

