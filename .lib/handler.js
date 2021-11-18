const helper = require('./dev');

let onDisconnect = async (socket, io) => {
    console.dir('SOCKET> ', socket);

    // transporter closed could not access socket data
    io.to(socket.roomID).emit('server', `${socket.username} leaved.`);
    
    // get room data
    helper.data.getRoom(socket.roomID, (err, data) => {
        if(!err && data){
            let dis_index = data.users.findIndex(u => u.id == socket.id);
            try{
                let removed = data.users.splice(dis_index, 1);
                if(removed){
                    // update data
                    helper.data.updateRoom(data, (error_u) => {
                        !error_u ? helper.log('SOCKET> ', `${socket.username} leaved`) : helper.log('SOCKET> ', `failed to update room data`);
                    })
                }else{
                    helper.log('SOCKET> ', 'failed to remove ' + socket.username);
                }
            }catch(e){
                helper.log('SOCKET> ', e);
            }
        }else{
            helper.log('SOCKET> ', err);
        }
    })
}

let CLI_CHECK = async (msg, callback) => {
    callback(false);
}

let processChat = async (socket, data) => {
    console.log(data);
    CLI_CHECK(data.message, async (error) => {
        if(!error){
            // data['init'] = moment().format('LT');
            data['sender'] = socket.username;
            socket.broadcast.to(data.room).emit('chat', data);
        }
    })    
}

let broadCastUserList = async (roomID, io, times) => {
    // send users list to all clients except
    // get all user list from room
    
    await helper.data.getRoom(roomID, async (err, data) => {
        if(!err && data){
            let users = await data.users.filter(u => u.id !== null);
            io.to(roomID).emit('user_list', users);
        }else{
            times = times + 1;
            helper.log('SOCKET> ', err)
            setTimeout(async () => {
                broadCastUserList(roomID, io, times);
            }, times * 5 * 1000)
        }
    })
}

module.exports.onConnection = (socket, io) => {
    let roomID = socket.handshake.auth.id.toString().trim();
    socket['roomID'] = roomID;

    // join roomID room
    socket.join(roomID);
    io.to(roomID).emit('new user', socket.username);
    io.to(roomID).emit('server', `${socket.handshake.auth.username} joined`);
    broadCastUserList(roomID, io, 0);

    socket.on('chat', data => processChat(socket, data));

    // get socket obj removed from io and files too
    socket.on('disconnect', (reason) => onDisconnect({roomID, username: socket.username, id: socket.id}, io)); 
}

module.exports.authSocket = (socket, next) => {
    let id = typeof(socket.handshake.auth.id) == 'string' && socket.handshake.auth.id.toString().trim().length > (4*4) ? socket.handshake.auth.id : false;
    let username = socket.handshake.auth.username.toString().trim();
    if(id){
        helper.data.getRoom(id, (err, room) => {
            if(!err && room){
                let DONE=false;
                room.users.forEach(u => {
                    if(u.username == username && u.id == null){
                        u.id = socket.id;
                        socket['username'] = username;
                        DONE=true;
                    }
                });
                if(DONE){
                    helper.data.updateRoom(room, (error) => {
                        if(!error){
                            helper.log('SOCKET> ', `${socket.id} registered`);
                            next();
                        }else{
                            socket.disconnect();
                        }
                    })
                }else{
                    socket.disconnect();
                }
            }else{
                socket.disconnect();
            }
        })
    }else{
        socket.disconnect();
    }
}
