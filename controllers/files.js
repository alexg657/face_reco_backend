const formidable = require('formidable');
const path = require('path')
const fs = require('fs');
const glob = require("glob")
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'face-reco',
    api_key: '269952856826464',
    api_secret: 'QJXAHU9-7LHIFsrHn_fq6qi3Ni8'
});


const handleFilesUpload = (req, res, next) => {
    const form = formidable.IncomingForm();
    let email = ''
    let filepath = ''
    form.parse(req)
        .on('field', (fieldName, fieldValue) => {
            if (fieldName === 'file' && fieldValue === '') {
                return res.json('err')
            }
            if (fieldName === 'email') {
                email = fieldValue
            }
        })
        .on('fileBegin', function (name, file) {

            file.path = './tmp/' + email + path.extname(file.name);

            //console.log('filebegin', file.path)
            filepath = file.path


        }).once('end', () => {

            cloudinary.uploader.upload(filepath,
                {
                    use_filename: true,
                    unique_filename: false,
                    overwrite: true
                },
                function (error, result) {

                    if (!error) {
                        response('OK')

                    }
                    else {
                        response('err')
                    }
                });
        });


    const response = (response) => {
        if (response === 'OK') {
            res.json(response)
        }
        else if (response === 'err') {
            res.json(response)
        }

        glob(`./tmp/${email}.*`, function (er, files) {
            if (files.length > 0) {
                //console.log(files)
                fs.unlinkSync(files[0])
            }
        })
    }
}

const handleFilesDownload = (req, res) => {

    cloudinary.api.resource((req.body.email).replace('@', '_'),
        function (error, result) {

            var request = require('request').defaults({ encoding: null });
            request.get(result.url, function (error, response, body) {

                if (!error && response.statusCode == 200) {
                    data = Buffer.from(body).toString('base64');

                    res.json(data)
                }
            });
        });

}


module.exports = {
    handleFilesUpload, handleFilesDownload
}