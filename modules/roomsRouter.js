const express=require('express')
const router=express.Router()
const global=require('./global')

router.get('/:roomId', (req,res)=>{
    // console.log('redirected to correct room')
    // console.log(global)
    // console.log('room id: '+ req.params.roomId, global.files[req.params.roomId])
    if(!global.files[req.params.roomId] ){
        res.status(404).render('error', {error: '404 Page not found'})
    }else{
        res.render('room', {
            roomId: req.params.roomId, 
            userName: req.user.name,
            fileName: global.files[req.params.roomId].name, 
            fileType: global.files[req.params.roomId].type }
        )
    }
})

global.io.on('connect', socket => {
    socket.on('join-room', (payload) =>{
        const userId=payload.id
        const roomId=payload.roomId
        
        socket.join(roomId)

        socket.broadcast.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', ()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })


        socket.on('welcome', payload=>{
            console.log('welcome packet', payload)
            socket.broadcast.to(roomId).emit('welcome', payload)
        })
        socket.on('new-message', payload =>{
            socket.broadcast.to(roomId).emit('new-message', payload)
        })
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
