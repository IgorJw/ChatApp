const socket = io()

const msg_container = document.querySelector('.msg_container')
const chatForm = document.getElementById("msg_form")
const input = document.getElementById("input_msg")
const submit = document.getElementById("submit")
const active_users = document.querySelector('.active_users_wrapper')
const roomName = document.querySelector('.room_name span')


const { username,room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
roomName.innerHTML = room
socket.emit('joinRoom',{username,room})



socket.on('my_message',message => {
    console.log(message)
    outputMyMessage(message)
    msg_container.scrollTop = msg_container.scrollHeight

})
socket.on('message',message => {
    console.log(message)
    outputMessage(message)
    msg_container.scrollTop = msg_container.scrollHeight

})

socket.on('active_users', ({room,users}) =>{
    active_users.innerHTML =`
    <div class="active_users_label">
        <span> Active Users : </span>
    </div>
    ${users.map(user => `
    
    <span class="active_user">${user.username}</span>`)}
    `

})


chatForm.addEventListener("submit", e => {
    console.log(5)
    e.preventDefault()
    const msg = input.value
    
    if(msg !== ''){
        socket.emit('chatMessage',msg)
        outputMyMessage(msg)   
        msg_container.scrollTop = msg_container.scrollHeight
        input.value = ''
        input.focus()
    }
})
    




function outputMyMessage(message){
    const msg_wrapper = document.createElement('div')
    const my_msg = document.createElement('div')
    const my_date = document.createElement('div')
    my_date.classList.add('my_date')
    my_date.innerHTML = "6.42PM"
    my_msg.classList.add('my_msg')
    my_msg.innerHTML = `${message}`
    msg_wrapper.classList.add('msg_wrapper')
    msg_wrapper.appendChild(my_msg)
    msg_wrapper.appendChild(my_date)
    document.querySelector('.msg_container').appendChild(msg_wrapper)
}
function outputMessage(message){
    const msg_wrapper = document.createElement('div')
    const msg = document.createElement('div')
    const date = document.createElement('div')
    const author = document.createElement('div')
    author.innerHTML = `${message.username}`
    author.classList.add('msg_author')
    date.classList.add('date')
    date.innerHTML = `${message.time}`
    msg.classList.add('msg')
    msg.innerHTML = `${message.text}`
    msg_wrapper.classList.add('msg_wrapper')
    msg_wrapper.appendChild(author)
    msg_wrapper.appendChild(msg)
    msg_wrapper.appendChild(date)
    
    document.querySelector('.msg_container').appendChild(msg_wrapper)
}