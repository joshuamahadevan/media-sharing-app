const express=require('express')
const router=express.Router()
const global=require('./global')

router.get('/:roomId', (req,res)=>{
    console.log('redirected to correct room')
    res.render('room', {roomId: req.params.roomId, fileName: global.files[req.params.roomId].name, fileType: global.files[req.params.roomId].type } )
})

//can include a '/' route to see all public rooms

module.exports=router
