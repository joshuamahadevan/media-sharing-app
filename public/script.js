console.log('script is running')

const socket=io('/')

//VIDEO SYNC

const userId = "id - " + Math.random().toString(16).slice(2)
console.log(userId)
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


//MESSAGING
const msg=document.getElementById('message')
const msgBox=document.getElementById('chat-box')

//sending msgs
const sendMessage = (e)=>{
    e.preventDefault();
    socket.emit('new-message', {message:msg.value, user:userId})

    //adding msg to dom
    const div=document.createElement('div')
    div.classList.add('user-message')
    div.innerHTML=`<p>${msg.value}</p>`
    msgBox.appendChild(div)

    console.log('emited message ',msg.value )
    msg.value=''
}
document.getElementById('message-form').onsubmit=sendMessage

//receiving msgs
socket.on('new-message', (payload)=>{
    console.log('received massage from ', payload.user)
    // const ele=document.createElement('p')
    // ele.innerHTML=payload.user+'<br>'+payload.message
    // msgBox.appendChild(ele)
    const div=document.createElement('div')
    div.classList.add('chat-message')
    div.innerHTML=`<h5>${payload.user}</h5><p>${payload.message}`
    msgBox.appendChild(div)
})