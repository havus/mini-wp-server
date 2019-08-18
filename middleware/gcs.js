const path = require('path');
require('dotenv').config({ path: __dirname+'/../.env' });
const { Storage } = require('@google-cloud/storage');
const CLOUD_BUCKET = process.env.CLOUD_BUCKET;

const gc = new Storage({
  keyFilename: path.join(__dirname, `../${process.env.KEYFILE_PATH}`),
  projectId: process.env.GCLOUD_PROJECT,
});

const bucket = gc.bucket(CLOUD_BUCKET);

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`
}

function sendUploadToGCS(req, res, next) {
  if (!req.file) {
    return next()
  }

  const gcsname = Date.now() + req.file.originalname
  const file = bucket.file(gcsname)

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  })

  stream.on('error', (err) => {
    req.file.cloudStorageError = err
    next(err)
  })

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname
    file.makePublic().then(() => {
      req.file.gcsUrl = getPublicUrl(gcsname);
      next();
    })
  })

  stream.end(req.file.buffer)
}


module.exports = sendUploadToGCS