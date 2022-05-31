const socket =  io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//get Username and room from url
const { sender, receiver } = Qs.parse(location.search, {
  ignoreQueryPrefix:true
});


//Join chatrooom 
socket.emit('joinChat', {sender,receiver});


socket.on('roomUsers', ({userid, users}) => {
//  outputRoomName(room);
    const index = users.findIndex(user => user.id === userid);
    
  outputUsers(users);
});

socket.on('roomUsersdata', ({userid, users}) => {
//  outputRoomName(room);
    const index = users.findIndex(user => user.id === userid);
    
  outputUsers(users);
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
  e.target.elements.value ='';
  e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span> ${message.time} </span></p>
  <p class="text"> ${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);

}

function outputRoomName(room) {
  roomName.innerText = ``;
}

function outputUsers(users) {
	
  userList.innerHTML = `
  ${users.map(user => `<li id='${users.id}'>${user.senderid}</li>`).join('')}
  `
}