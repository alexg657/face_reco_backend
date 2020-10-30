
const { SMTPClient } = require('emailjs')


const handleForgotPassword = (req, res, bcrypt, knex) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json('something missing')

    }
    else {
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }


        //generate string 
        let generatePass = Math.random().toString(36).substring(7);


        if (validateEmail(email)) {
            const hash = bcrypt.hashSync(generatePass);

            knex('login')
                .where({ email })
                .update({
                    temporaryHash: hash
                })
                .returning('*')
                .then(result => {
                    if (!Object.keys(result).length) {
                        res.json('No such email found in the system')
                    }
                    else {

                        const client = new SMTPClient({
                            user: process.env.GMAIL_USER,
                            password: process.env.GMAIL_PASSWORD,
                            host: 'smtp.gmail.com',
                            ssl: true
                        });
                        

                        client.send({

                            text: `Your temporary password is: ${generatePass}`,
                            from: '"face_reco Support" <face.reco.backend@gmail.com>',
                            to: email,
                            subject: 'Reset password'
                        });

                        res.json('ok')
                    }

                })
                .catch(() => res.status(400).json('unable to reset password'))

        }
        else {
            res.json('Invalid email')
        }
    }
}
const handleRenewPassword = (req, res, bcrypt, knex) => {

    const { email, TemporaryPassword, NewPassword } = req.body;
    if (!TemporaryPassword || !NewPassword) {
        return res.status(400).json('something missing')

    }
    else {
        knex('login')
            .where({ email })
            .then(result => {

                if (bcrypt.compareSync(TemporaryPassword, result[0].temporaryHash)) {

                    const hash = bcrypt.hashSync(NewPassword);

                    knex('login')
                        .where({ email })
                        .update({
                            hash: hash
                        })
                        .then(() =>
                            res.json('Password updated successfully')
                        )

                        .catch(() => res.status(400).json('unable to update password'))

                }
                else {
                    res.json('Wrong temporary password')
                }
            })
    }
}


module.exports = {
    handleForgotPassword, handleRenewPassword
}