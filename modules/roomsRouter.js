const express=require('express')
const router=express.Router()
const global=require('./global')
const io=require('socket.io')

router.get('/:roomId', (req,res)=>{
    // console.log('redirected to correct room')
    // console.log(global)
    // console.log('room id: '+ req.params.roomId, global.files[req.params.roomId])
    res.render('room', {roomId: req.params.roomId, fileName: global.files[req.params.roomId].name, fileType: global.files[req.params.roomId].type } )
})

global.io.on('connect', socket => {
    socket.on('join-room', (roomId) =>{
        socket.join(roomId)

        socket.on('pause', payload=>{ 
            socket.broadcast.to(roomId).emit('pause', payload)
        })
        socket.on('play', payload=>{ 
            socket.broadcast.to(roomId).emit('play', payload)
        })
    })
})

//can include a '/' route to see all public rooms

module.exports=router
