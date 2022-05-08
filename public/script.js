console.log('script is running')
const socket=io('/')

const myPeer=new Peer()

myPeer.on( 'open' , (id)=>{
    socket.emit('join-room', {roomId, id})
})
//VIDEO SYNC

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


//MESSAGING
const msg=document.getElementById('message')
const msgBox=document.getElementById('chat-box')

//sending msgs
const sendMessage = (e)=>{
    e.preventDefault();
    socket.emit('new-message', {message:msg.value, user:userName})

    //adding msg to dom
    const div=document.createElement('div')
    div.classList.add('chat-message')
    div.innerHTML=`<h2>You</h2><p>${msg.value}</p>`
    msgBox.appendChild(div)

    console.log('emited message ',msg.value )
    msg.value=''
}
document.getElementById('message-form').onsubmit=sendMessage

//receiving msgs
socket.on('new-message', (payload)=>{
    console.log('received massage from ', payload.user)
    const div=document.createElement('div')
    div.classList.add('chat-message')
    div.innerHTML=`<h2>${payload.user}</h2><p>${payload.message}`
    msgBox.appendChild(div)
})

//VIDEO-CALL

const videogrid=document.getElementById('video-grid')

const myVideo=document.createElement('video')
myVideo.muted=true

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then( stream => {
    addVideoStream(myVideo, stream)
    
    myPeer.on('call', call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId)=>{
        connectToNewUser(userId, stream)
    })
})

const peers={}

socket.on('user-disconnected', (userId)=>{
    if(peers[userId]) peers[userId].close()
})



function connectToNewUser(userId, stream){
    const call=myPeer.call(userId, stream)
    peers[userId]=call
    const video=document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })
    call.on('close', ()=>{
        video.remove()
    })
}

function addVideoStream( video, stream){
    video.srcObject=stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videogrid.appendChild(video)
}