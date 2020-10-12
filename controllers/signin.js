const handleSignin = (req, res, bcrypt, knex) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('something missing')

    }
    knex.select('hash', 'email')
        .from('login')
        .where({ email })
        .then(login => {
            const hash = login[0].hash;
            if (bcrypt.compareSync(password, hash)) {
                knex.select('*').from('users').where({ email })
                    .then(user => {
                        res.json(user[0])
                    })
            }
            else {
                res.status(404).json('wrong username or password')
            }
        })
        .catch(err => res.status(400).json('unable to get user'))
}

module.exports = {
    handleSignin
}