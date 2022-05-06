console.log('script is running')

const socket=io('/')

// const userId = "id - " + Math.random().toString(16).slice(2)
socket.emit('join-room', roomId)

//select vid element
const vid=document.getElementById('video-player')

//emit events. for any change in video element
vid.addEventListener( 'pause', ()=>{
    socket.emit('pause')
    console.log("emited pause")
})
vid.addEventListener( 'play', ()=>{
    socket.emit('play', vid.currentTime)
    console.log("emited play")
})

//receive events from socket
socket.on('pause', ()=>{ vid.pause() })
socket.on('play', (time)=>{
    vid.currentTime=time
    vid.play()
})