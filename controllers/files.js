const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'face-reco',
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


const handleFilesUpload = (req, res) => {

    cloudinary.uploader.upload(req.body.base64,
        {
            unique_filename: false,
            overwrite: true,
            public_id: req.body.email
        },
        function (error, result) {

            if (!error) {
                res.json('OK')

            }
            else {
                res.json('err')
            }
        });

}

const handleFilesDownload = (req, res) => {

    cloudinary.api.resource((req.body.email),
        function (error, result) {
            if (!error) {

                var request = require('request').defaults({ encoding: null });
                request.get(result.url, function (error, response, body) {

                    if (!error && response.statusCode == 200) {
                        data = Buffer.from(body).toString('base64');

                        res.json(data)
                    }
                });
            }
            });
}


module.exports = {
    handleFilesUpload, handleFilesDownload
}