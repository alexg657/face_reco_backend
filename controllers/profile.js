
const handleProfile = (req, res, knex, bcrypt) => {

    let { name, email, password, newemail, getUpdate, getDelete } = req.body;
    let count = 0, finish = 0;//count filled inputs, finish promises

    const final = (user) => {

        if (count == 1) {
            if (finish == 1) {
                res.json(user)
            }

        }
        else if (count == 2) {
            if (finish == 2) {
                res.json(user)
            }
        }
        else if (count == 3) {
            if (finish == 3) {
                res.json(user)
            }
        }
    }


    if (getUpdate) {

        if (name) {
            count++;
            knex('users')
                .where({ email })
                .update({
                    name: name
                })
                .returning('*')
                .then(user => {
                    finish++;
                    final(user[0])

                })
                .catch(() => res.status(400).json('unable to update name'))

        }
        if (password) {
            count++;
            const hash = bcrypt.hashSync(password);

            knex('login')
                .where({ email })
                .update({
                    hash: hash
                })
                .then(() =>
                    knex('users')
                        .where({ email })
                        .then(user => {
                            finish++;
                            final(user[0])
                        })
                )

                .catch(() => res.status(400).json('unable to update password'))
        }
        if (newemail) {
            count++;
            knex.transaction(trx => {
                trx('login')
                    .where({ email })
                    .update({
                        email: newemail
                    })
                    .then(() => {
                        trx('users')
                            .where({ email })
                            .update({
                                email: newemail
                            })
                            .returning('*')
                            .then(user => {
                                finish++;
                                final(user[0])
                            })
                            .then(trx.commit)
                            .catch(trx.rollback)

                    }).then(() => {
                        email = newemail;
                        //trx success
                    })

            }).catch(() => res.status(400).json('unable to update email'))
        }
        if (!name && !password && !newemail) {
            res.json('empty')
        }
        
    }
    else if (getDelete) {

        knex.transaction(trx => {
            trx('login')
                .where({ email })
                .del()
                .then(() => {
                    trx('users')
                        .where({ email })
                        .del()
                        .then(trx.commit)
                        .catch(trx.rollback)

                }).then(() => {
                    res.json('success')
                    //trx success
                })

        }).catch(() => res.status(400).json('unable to delete account'))
        
    }

}
module.exports = {
    handleProfile
}