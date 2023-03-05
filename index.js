const stream = require('stream');
const express = require('express')
const ytdl = require('ytdl-core');
const cors = require('cors');
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const app = express()
const port = 3000

app.use(cors())

app.get('/download', async(req, res) => {
  if(req.query.url){ 
    const passtrough = new stream.PassThrough();
    const filename = (await ytdl.getBasicInfo(req.query.url)).videoDetails.title;
   //res.setHeader('Content-Disposition', `attachmentt; filename=${filename}.mp4`)

    const putObjectPromise = await s3.putObject({
      Bucket: process.env.CYCLIC_BUCKET_NAME,
      Key: filename,
      Body: passtrough
    }).promise();

    res.status(200).json(putObjectPromise);

    ytdl(req.query.url).pipe(passtrough)
  }

  return res.status(500).send();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
