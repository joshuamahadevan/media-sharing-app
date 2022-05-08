const express=require('express')
const router=express.Router()
const fs=require('fs')

router.get('/:fileName', (req,res)=>{
    const fileName=req.params.fileName

    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
        res.status(400).render('error',{error: "Requires Range header"});
    }

    // get video stats
    const videoPath = `uploads/${fileName}`;
    const videoSize = fs.statSync(videoPath).size;

    // Parse Range
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to 
    videoStream.pipe(res);
})

module.exports=router