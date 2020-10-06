const handleProfile = (req, res, knex, bcrypt) => {

    let { name, email, password, newemail, getUpdate, getDelete } = req.body;
    if (getUpdate) {

        if (name) {

            knex('users')
                .where({ email })
                .update({
                    name: name
                })

                .catch(() => res.status(400).json('unable to update name'))
        }
        if (password) {
            const hash = bcrypt.hashSync(password);

            knex('login')
                .where({ email })
                .update({
                    hash: hash
                })
                .then(() =>
                    knex('users')
                        .where({ email })
                )

                .catch(() => res.status(400).json('unable to update password'))
        }
        if (newemail) {
            knex.transaction(trx => {
                trx('login')
                    .where({ email })
                    .update({
                        email: newemail
                    })
                    .returning('email')
                    .then(() => {
                        trx('users')
                            .where({ email })
                            .update({
                                email: newemail
                            })
                            .then(trx.commit)
                            .catch(trx.rollback)

                    }).then(() => {
                        email = newemail;
                        //trx success
                    })

            }).catch(() => res.status(400).json('unable to update email'))
        }

        knex('users')
            .where({ email })
            .then(user => {

                if (user[0].id) {
                    res.json(user[0])
                }
                else {
                    res.status(404).json('res err')
                }

            })
            .catch(err => res.status(400).json('err'))
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