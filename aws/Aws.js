// handlers for uploading images to Aws
const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;

aws.config.region = 'us-west-2';

const getSignedData = (request, response) => {
  const s3 = new aws.S3();
  const fileName = request.query['file-name'];
  const fileType= request.query['file-type'];
  console.log(fileName);
  console.log(fileType);
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  }

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err) {
      console.log(err);
      return response.end();
    }

    const returnData = {
      signedData: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };

    res.write(JSON.stringify(returnData));
    res.end();
  });
};

module.exports = { getSignedData };