const socket =  io();

const usernameId = document.getElementById('username');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const { sender, receiver } = Qs.parse(location.search, {
  ignoreQueryPrefix:true
});

socket.emit('joinRoom', {sender,receiver});
console.log(':::::::JOIN ROOM::::::::::');

setReceiverName(sender);

function setReceiverName(sender) {
  usernameId.innerHTML = sender;
}

//Join chatrooom 
//socket.emit('joinRoom', {username,room});

//Get room and users
 socket.on('roomUsers', Chatmsg => {
  //console.log('CHAT MSG first');
  LastMessage(Chatmsg);
 });

// message from server
socket.on('message', message => {

  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) =>{
e.preventDefault();
  const msg = e.target.elements.msg.value;
  // Emit Chat Message to server
  socket.emit('chatMessage',msg);

  // clear current message and focus input field
  e.target.elements[0].value ='';
  e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');

if(sender == message.username) {
  div.classList.add('message'); 
  div.classList.add('sender');
 } else {
  div.classList.add('message');
 }
 
  div.innerHTML = `<p class="meta">${message.username} <span> ${message.time} </span></p>
  <p class="text"> ${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

function LastMessage(Chatmsg) {
  //console.log('LastMessage called');
    console.log(socket.id);

    for (let i = 0; i < Chatmsg['chatMsg'].length; i++) {

     const div = document.createElement('div');
     if(sender == Chatmsg['chatMsg'][i].senderid) {
      div.classList.add('message'); 
      div.classList.add('sender');
     } else {
      div.classList.add('message');
     }
     
     div.innerHTML = `<p class="meta" >${Chatmsg['chatMsg'][i].senderid} <span> ${Chatmsg['chatMsg'][i].created_at} </span></p>
     <p class="text"> ${Chatmsg['chatMsg'][i].msg}</p>`;
     document.querySelector('.chat-messages').appendChild(div);
    }
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
  ${users.map(user => `<li >${user.username}</li>`).join('')}
  `
}