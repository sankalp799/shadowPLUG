const helper = require('./dev');

let onDisconnect = async (socket, io) => {
    try{
        await helper.data.getRoom(socket.handshake.auth.id, async (error, data) => {
            if(!error && data){
                let roomID = socket.handshake.auth.id;
                let dis_socket_index = await data.users.findIndex(u => u.id == socket.id);
                let disconnect_socket = await data.users.splice(dis_socket_index, 1);
                socket.disconnect();
                await helper.log('SOCKET> ', `${disconnect_socket.id} - ${disconnect_socket.username} got disconnected`);
                io.to(data.id).emit('server', `${disconnect_socket.username} leaved`);
                await helper.data.updateRoom(data, async (DONE) => {
                    if(!DONE){
                        await helper.log('USER> ', `${disconnect_socket.id} disconnected from room ${data.id}.json`);
                        socket.disconnect();
                        broadCastUserList(roomID, io, 0);
                    }else{
                        socket.disconnect();
                        await helper.log('USER> ', `failed to remove ${disconnect_socket.id} from ${data.id}.json`);
                    }
                })
            }else{
                socket.disconnect();
            }
        })
    }catch(e){
        socket.disconnect();
        console.error(e);
    }
}

let CLI_CHECK = async (msg, callback) => {
    callback(false);
}

let processChat = async (socket, data) => {
    CLI_CHECK(data.message, async (error) => {
        if(!error){
            // data['init'] = moment().format('LT');
            data['sender'] = socket.username;
            socket.to(socket.handshake.auth.id).emit('chat', data);
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
    
    // join roomID room
    socket.join(roomID);
    socket.to(roomID).emit('server', `${socket.handshake.auth.username} joined`);
    broadCastUserList(roomID, io, 0);

    socket.on('chat', data => processChat(roomID, io));

    // get socket obj removed from io and files too
    socket.on('disconnect', (socket) => onDisconnect(socket, io)); 
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
                        socket.username = username;
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
