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
        host: 'ec2-3-210-255-177.compute-1.amazonaws.com',
        user: 'byndcsinjlssnq',
        password: '2ae870e95188a0f60796ae56e5c0b5348245f34edc98ee60a41b5eb73c186338',
        database: 'dco58kksumcseo'
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

