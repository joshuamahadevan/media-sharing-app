//initialisation
const express=require('express')
const app=express()
const http=require('http')
const httpServer=http.createServer(app)
const multer=require('multer')
const {v4:uuidv4} = require('uuid')
const fs=require('fs')

//port 
const PORT=3000

//multer setup - for file upload
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads')
    },
    filename: (req,file,cb) =>{
        req.fileType=file.mimetype
        req.filename=Date.now()+'--'+file.originalname
        cb(null, req.filename)
    }
})
const upload = multer({storage: fileStorageEngine})

//middle ware
app.set('view engine', 'ejs') //view engine
app.use(express.json()) //parser for json
app.use(express.urlencoded({extended: true})) //pareser for url-encoded 

//routes

//home route
app.get('/', (req,res)=>{
    res.render('home')
})

//route to handle uploads
const files={}
app.post('/upload', upload.single('video-file'), (req,res)=>{
    const roomId=uuidv4()
    files[roomId]={name: req.filename, type: req.fileType}
    res.redirect(`rooms/${roomId}`)
})

//router to handle rooms
app.get('/rooms/:roomId', (req,res)=>{
    res.render('room', {roomId: req.params.roomId, fileName: files[req.params.roomId].name, fileType: files[req.params.roomId].type } )
})

app.get('/stream/:fileName', (req,res)=>{
    const fileName=req.params.fileName

    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }

    // get video stats
    const videoPath = `uploads/${fileName}`;
    const videoSize = fs.statSync(`uploads/${fileName}`).size;

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

//listen to port

// app.listen(PORT | 3000, ()=>{
//     console.log(`Server running at ${PORT | 3000}`)
// })

httpServer.listen(PORT | 3000, ()=> console.log(`Server started at port ${PORT | 3000}`))