const handleProfile = (req, res, knex, bcrypt) => {

    const { name, email, password } = req.body;
    // if (name) {
    //     knex('users')
    //         .where({ email })
    //         .returning('*')
    //         .update({
    //             name: name
    //         })

    //         .then(user => {
    //             if (user.length) {
    //                 res.json(user[0])
    //             }
    //             else {
    //                 res.status(404).json('user not found')
    //             }

    //         })
    //         .catch(err => res.status(400).json('unable to update user'))
    // }
    if (password) {
        const hash = bcrypt.hashSync(password);
        knex('login')
            .where({ email })
            .update({
                hash: hash
            })
            .then(()=>
                knex('users')
                    .where({ email })
                    .then(user => {
                        if (user.length) {
                            res.json(user[0])
                        }
                        else {
                            res.status(404).json('user not found')
                        }

                    })
            )

            .catch(err => res.status(400).json('unable to update user'))
    }




}
module.exports = {
    handleProfile
}