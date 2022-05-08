console.log('script is running')
const socket=io('/')

const myPeer=new Peer()


//VIDEO SYNC
let synced=false
//select vid element
const vid=document.getElementById('video-player')

myPeer.on( 'open' , (id)=>{
    socket.emit('join-room', {roomId, id})
})

//emit events. for any change in video element
vid.addEventListener( 'pause', ()=>{
    synced=true
    socket.emit('pause')
    console.log("emited pause")
})
vid.addEventListener( 'play', ()=>{
    synced=true
    socket.emit('play', vid.currentTime)
    console.log("emited play")
})

//receive events from socket
socket.on('welcome', payload =>{
    console.log('got welcome package')
    console.log(payload)
    if(!synced){
        vid.currentTime=payload.time
        if(payload.paused) vid.pause()
        else vid.play()            
    }
    synced=true
})
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

const peers={}
const videos={}

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then( stream => {
    addVideoStream(myVideo, stream)
    
    myPeer.on('call', call =>{
        peers[call.peer]=call;
        call.answer(stream)
        const video = document.createElement('video')
        videos[call.peer]=video
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId)=>{
        if(synced) socket.emit('welcome', {time: vid.currentTime, paused: vid.paused})
        console.log('send welcome package')
        connectToNewUser(userId, stream)
    })
})



socket.on('user-disconnected', (userId)=>{
    videos[userId].remove()
    if(peers[userId]) peers[userId].close()
    console.log('closed ', peers[userId],' with ',userId)
})



function connectToNewUser(userId, stream){
    const call=myPeer.call(userId, stream)
    peers[userId]=call
    const video=document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
        videos[userId]=video
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