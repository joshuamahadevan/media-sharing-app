//initialisation
const express=require('express')
const app=express()
const http=require('http')
const httpServer=http.createServer(app)
const multer=require('multer')
const {v4:uuidv4} = require('uuid')

//port 
const PORT=3000

//multer setup - for file upload
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads')
    },
    filename: (req,file,cb) =>{
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
    files[roomId]=req.filename
    res.redirect(`rooms/${roomId}`)
})

//router to handle rooms
app.get('/rooms/:roomId', (req,res)=>{
    res.send(`Inside room ${req.params.roomId} which shares the file ${files[req.params.roomId]}`)
})

//listen to port

// app.listen(PORT | 3000, ()=>{
//     console.log(`Server running at ${PORT | 3000}`)
// })

httpServer.listen(PORT | 3000, ()=> console.log(`Server started at port ${PORT | 3000}`))