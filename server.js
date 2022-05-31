const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(path.join(__dirname,'public')));

const formatMessage = require('./utils/messages');
const {userJoin, GetCurrentUser,userLeave,getUsers,SenderJoin,GetCurrentUserdata,userdataLeave,getPrivateUsers,
LoadMsg} = require('./utils/users');

const mysql = require('mysql');
const botName = 'Chatbot ';

var connection=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'chat'
 });
// Run when client connction 
io.on('connection', socket => {

    socket.on('joinRoom',({sender, receiver}) =>{
        const rows = [];

        console.log(':::::::JOIN SERVER ROOM::::::::::');

        connection.query('SELECT * FROM user WHERE username ="'+sender+'"',function(err,rows) {
        if(err){
        }else{
            if(rows != '') {
                connection.query('SELECT * FROM user WHERE username ="'+sender+'"',function(err,rows) {
                });             
            } else {
                connection.query('INSERT INTO user(username) VALUES("'+sender+'")',function(err,rows){});    
            }
        }
        });
        //console.log('First time Load Msg Data. ');
        const userdata = SenderJoin(socket.id,sender,receiver);
        connection.query('SELECT * FROM chat_tbl WHERE (senderid ="'+userdata.senderid+'" and receiverid ="'+userdata.receiverid+'") OR (senderid ="'+userdata.receiverid+'" and receiverid ="'+userdata.senderid+'") order by created_at',function(err,rows) {
                io.to(userdata.id).emit('roomUsers',{
                     chatMsg : rows
                });
            });
        socket.join(userdata.id); // JOIN PARTICULAR ROOM   
    });

    /*socket.on('joinRoom',({username, room}) =>{
        const user = userJoin(socket.id,username,room);
        socket.join(user.room); // JOIN PARTICULAR ROOM 

        // Welcome User.
        socket.emit('message',formatMessage(botName,' Welcome to Chat App'));
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat `));

         io.to(user.id).emit('roomUsers',{
             userid : user.id,
             users : getUsers()//getRoomUsers(user.room)
         });
    });*/
    
   // Runs when client  disconnects
    socket.on('disconnect',() => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(userdata.senderid).emit('message',formatMessage(botName,`${userdata.senderid} has left the chat`));
            io.to(userdata.senderid).emit('roomUsers', {
                userid : userdata.senderid,
                userdata : getPrivateUsers(userdata.privateChatId),//getRoomUsers(user,senderid)
            });

            io.to(userdata.receiverid).emit('message',formatMessage(botName,`${userdata.senderid} has left the chat`));    
            io.to(userdata.id).emit('roomUsers',{
                userid : userdata.id,
                userdata : getPrivateUsers(userdata.privateChatId)
            });
        }
    });

    socket.on('chatMessage', msg => {
        const userdata = GetCurrentUserdata(socket.id);
        
        connection.query('INSERT INTO chat_tbl(senderid,receiverid,msg,socket_id) VALUES("'+userdata.senderid+'","'+userdata.receiverid+'","'+msg+'","'+socket.id+'")',function(err,rows){
            //console.log(rows);        
        }); 
        // io.to(userdata.senderid).emit('message',formatMessage(userdata.senderid ,msg));
        io.emit('message',formatMessage(userdata.senderid,msg));
    });
});
const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=> console.log(` Server running on port ${PORT}`));
