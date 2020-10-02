const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_KEY
});

const handleImage = (req, res, knex) => {
    const { id } = req.body;
    knex('users')
        .where({ id })
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])

        })
        .catch(err => res.status(400).json('unable to get entries'))
}

const clarifai = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(response => {
            res.json(response.outputs[0].data.regions[0].region_info.bounding_box)
        })

}


module.exports = {
    handleImage,
    clarifai
}