//initialisation
const global=require('./modules/global')
const express=require('express')
const app=express()
const http=require('http')
const httpServer=http.createServer(app)
global.io=require('socket.io')(httpServer)
const uploadRouter = require('./modules/uploadRouter')
const streamRouter = require('./modules/streamRouter')
const roomsRouter = require('./modules/roomsRouter')
const {authRouter, verify}=require('./modules/auth')
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/mediaShare', ()=>{
    console.log('connected to database')
})
const cookieParser = require('cookie-parser')

//port 
const PORT=3000

//middle ware
app.set('view engine', 'ejs') //view engine
app.use(express.json()) //parser for json
app.use(express.urlencoded({extended: true})) //pareser for url-encoded 
app.use(express.static('public'))
app.use(cookieParser())

//ROUTERS

//public routes
app.use('/auth', authRouter)
app.get('/', (req,res)=>{  
    res.render('home')
})

app.use(verify)
//protected routes

app.use('/upload', uploadRouter)
app.use('/rooms', roomsRouter)
app.use('/stream', streamRouter)


//listen to port
httpServer.listen(PORT | 3000, ()=> console.log(`Server started at port ${PORT | 3000}`))