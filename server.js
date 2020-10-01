const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const handleRegister = require('./controllers/register');
const handleSignin = require('./controllers/signin');
const handleImage = require('./controllers/image');
const handleProfile = require('./controllers/profile');


var knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '5555',
        database: 'face_reco'
    }
});

  

app.use(express.json());//middleware
app.use(cors());

// app.get('/', (req, res) => {
//     res.json(database.users)
// })

app.post('/signin', (req, res) => {
    handleSignin.handleSignin(req, res, bcrypt, knex)

})



app.post('/register', (req, res) => {
    handleRegister.handleRegister(req, res, bcrypt, knex);
})

//optional
app.get('/profile/:id', (req, res) => {
    handleProfile.handleProfile(req, res, knex)

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

