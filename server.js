//initialisation
const express=require('express')
const app=express()

//setup
const PORT=3000

//middle ware
app.set('view engine', 'ejs') //view engine
app.use(express.json()) //parser for json
app.use(express.urlencoded({extended: true})) //pareser for url-encoded 

//routes
app.get('/', (req,res)=>{
    res.send("Hello!")
})

//listen to port
app.listen(PORT | 3000, ()=>{
    console.log(`Server running at ${PORT | 3000}`)
})