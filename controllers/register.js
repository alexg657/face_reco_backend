const handleRegister=(req,res,bcrypt,knex)=>{

const { name, email, password } = req.body;
if(!name || !email || !password)
{
    return res.status(400).json('something missing')
}
    const hash = bcrypt.hashSync(password);

    knex.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()

                    })
                    .then(user => {

                        res.json(user[0])
                    })
                    .then(trx.commit)

            })

            .catch(trx.rollback)

    }).catch(err => res.status(400).json('unable to register'))
}

module.exports={
    handleRegister
}