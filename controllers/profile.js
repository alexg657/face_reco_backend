const handleProfile = (req, res, knex, bcrypt) => {

    const { name, email, password } = req.body;

    knex('users')
        .where({ email })
        .update({
            name: 'archived'
        })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            }
            else {
                res.status(404).json('user not found')
            }

        })
        .catch(err => res.status(400).json('unable to update user'))



}
module.exports = {
    handleProfile
}