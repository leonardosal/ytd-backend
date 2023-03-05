const express = require('express')
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express()
const port = 3000

app.use(cors())

app.get('/download', async(req, res) => {
  if(req.query.url){
    const filename = (await ytdl.getBasicInfo(req.query.url)).videoDetails.title;
    res.setHeader('Content-Disposition', `attachmentt; filename=${filename}.mp4`)
    return ytdl(req.query.url).pipe(res);
  }

  return res.status(500).send();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
