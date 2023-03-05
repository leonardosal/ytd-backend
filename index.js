const stream = require('stream');
const express = require('express')
const ytdl = require('ytdl-core');
const cors = require('cors');
const AWS = require("aws-sdk");
const app = express()
const port = 3000

app.use(cors())

app.get('/download', async(req, res) => {
  if(req.query.url){ 
    const passtrough = new stream.PassThrough();
    const filename = (await ytdl.getBasicInfo(req.query.url)).videoDetails.title;
   //res.setHeader('Content-Disposition', `attachmentt; filename=${filename}.mp4`)

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: filename,
        Body: passtrough
      },
      partSize: 1024 * 1024 * 64 // in bytes
    });

    upload.on('httpUploadProgress', (progress) => {
      console.log(`[${req.query.url}] copying video ...`, progress);
    });

    upload.send((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json({
          bucketName: process.env.CYCLIC_BUCKET_NAME,
          key: filename,
          url: `s3://${process.env.CYCLIC_BUCKET_NAME}/${key}`
        });
      }
    });
    ytdl(req.query.url).pipe(passtrough)
  }

  return res.status(500).send();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
