const formidable = require('formidable');
const path = require('path')
const fs = require('fs');
const glob = require("glob")
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'face-reco',
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
// cloudinary.config({
//     cloud_name: 'face-reco',
//     api_key: '269952856826464',
//     api_secret: 'QJXAHU9-7LHIFsrHn_fq6qi3Ni8'
// });

const handleFilesUpload = (req, res, next) => {


    //console.log(req.body.base64)

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
                res.json('err', error)
            }
        });



    // function base64_encode(file) {
    //     // read binary data
    //     var bitmap = fs.readFileSync(file);
    //     // convert binary data to base64 encoded string
    //     return new Buffer(bitmap).toString('base64');
    // }


    //multipart/form-data
    //Cloudinary::Uploader.upload("data:image/png;base64,#data#")


    // const form = formidable.IncomingForm();
    // let email = ''
    // let filepath = ''
    // form.parse(req)
    //     .on('field', (fieldName, fieldValue) => {
    //         if (fieldName === 'file' && fieldValue === '') {
    //             return res.json('err')
    //         }
    //         if (fieldName === 'email') {
    //             email = fieldValue
    //         }
    //         console.log(typeof(fieldValue))
    //     })
    //     .on('fileBegin', function (name, file) {

    //         console.log(base64_encode(file.path))

    //         // file.path = `${path.dirname(require.main.filename)}\\tmp\\` + email + path.extname(file.name);

    //         // //console.log('filebegin', file.path)
    //         // filepath = file.path


    //     }).once('end', () => {

    //         // cloudinary.uploader.upload(filepath,
    //         //     {
    //         //         use_filename: true,
    //         //         unique_filename: false,
    //         //         overwrite: true
    //         //     },
    //         //     function (error, result) {

    //         //         if (!error) {
    //         //             response('OK')

    //         //         }
    //         //         else {
    //         //             response('err')
    //         //         }
    //         //     });
    //     });


    // const response = (response) => {
    //     if (response === 'OK') {
    //         res.json(response)
    //     }
    //     else if (response === 'err') {
    //         res.json(response)
    //     }

    // glob(`${path.dirname(require.main.filename)}\\tmp\\${email}.*`, function (er, files) {
    //     if (files.length > 0) {
    //         //console.log(files)
    //         fs.unlinkSync(files[0])
    //     }
    // })
    //}
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

//console.log(`${path.dirname(require.main.filename)}\\tmp`)

}


module.exports = {
    handleFilesUpload, handleFilesDownload
}