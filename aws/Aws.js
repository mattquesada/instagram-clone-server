// handlers for uploading images to Aws
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const crypto = require('crypto');
const mime = require('mime');
const S3_BUCKET = process.env.S3_BUCKET;

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2'
})
const s3 = new aws.S3();

const uploadConfig = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET,
    acl: 'public-read',
    key: (request, file, callback) => {
      crypto.pseudoRandomBytes(16, (err, raw) => {
        callback(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
      });
    }
  }),
  limits: { fieldSize: 25 * 1024 * 1024 }
});

const uploadImage = (request, response) => {
  const singleUpload = uploadConfig.single('image');
  
  singleUpload(request, response, (err, some) => {
    if (err) {
      let responseObject = { errors: [{title: 'Image Upload Error', detail: err.message}] };
      return response.status(422).send(responseObject);
    }
    return response.json({imageUrl: request.file.location});
  }) 
};

module.exports = { uploadImage };