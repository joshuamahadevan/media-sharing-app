const express=require('express')
const router=express.Router()
const global=require('./global')

const multer=require('multer')
const {v4:uuidv4} = require('uuid')


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

//route to handle uploads
router.post('/', upload.single('video-file'), (req,res)=>{
    const roomId=uuidv4()
    global.files[roomId]={name: req.filename, type: req.fileType}
    console.log('file uploaded')
    res.redirect(`rooms/${roomId}`)
})

module.exports=router