const stream = require('stream');
const express = require('express')
const ytdl = require('ytdl-core');
const cors = require('cors');
const fs = require('@cyclic.sh/s3fs/promises')(process.env.CYCLIC_BUCKET_NAME)
const app = express()
const port = 3000

app.use(cors())

app.get('/download', async(req, res) => {
  if(req.query.url){ 
    const filename = (await ytdl.getBasicInfo(req.query.url)).videoDetails.title;

    ytdl(req.query.url).pipe(fs.writeFile(filename))

    res.status(200);
  }

  return res.status(500).send();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
