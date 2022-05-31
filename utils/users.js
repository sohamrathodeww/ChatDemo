const users =[];

const usersData = [];

const msgData = [];


function SenderJoin(id,senderid,receiverid){
    //console.log('id is '+id);
    //console.log('senderid is '+senderid);
    //console.log(' receiverid is '+receiverid);
    const user = {id,senderid, receiverid};
    
    usersData.push(user);
    return user;
}

function userJoin(id,username,room){
    const user = {id,username, room};
    
    users.push(user);
    return user;
}

function GetCurrentUser(id) {
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        return users.splice(index,1)[0];
    }
}

function getUsers() {
    return users;
}

function userdataLeave(id) {
    const index = usersData.findIndex(user => user.id === id);

    if(index !== -1) {
        return usersData.splice(index,1)[0];
    }
}
function GetCurrentUserdata(id) {

    return usersData.find(user => user.id === id);
}

function getPrivateUsers(room) {
    return usersData.filter(user => user.privateChatId === room);
}
function LoadMsg(rows) {
    return msgData = rows;
}

module.exports = {
    userJoin,
    GetCurrentUser,
    userLeave,
    getUsers,
    SenderJoin,
    GetCurrentUserdata,
    userdataLeave,
    getPrivateUsers,
    LoadMsg
}