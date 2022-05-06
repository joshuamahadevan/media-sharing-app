//initialisation
const express=require('express')
const app=express()
const http=require('http')
const httpServer=http.createServer(app)
const uploadRouter = require('./modules/uploadRouter')
const streamRouter = require('./modules/streamRouter')
const roomsRouter = require('./modules/roomsRouter')

//port 
const PORT=3000

//middle ware
app.set('view engine', 'ejs') //view engine
app.use(express.json()) //parser for json
app.use(express.urlencoded({extended: true})) //pareser for url-encoded 

app.get('/', (req,res)=>{  
    res.render('home')
})

//routers
app.use('/upload', uploadRouter)
app.use('/rooms', roomsRouter)
app.use('/stream', streamRouter)

//listen to port
httpServer.listen(PORT | 3000, ()=> console.log(`Server started at port ${PORT | 3000}`))