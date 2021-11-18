const socketio = io(location.origin, {
    transports: ['websocket'],
    autoconnect: false,
    path:'',
    auth: {
        id: sessionStorage.getItem('id'),
        username: sessionStorage.getItem('username'),
    }
});

socketio.connect();

socketio.on('connect_error', err => {
    console.log(err);
})

socketio.on('connection', socket => {
    console.log('connected');
})


socketio.on('user_list', data => console.log(data));
socketio.on('chat', data => console.log(data));
socketio.on('new user', username => console.log(username));

let randomIdGen = (prefix) => {
    let randoms = 'asdfghjklqwertyuiopzxcvbnm1234567890';
    let id = prefix + '-';
    for(let c=0; c<5; c++)
        id += randoms[Math.floor(Math.random() * randoms.length)];
}

let sendMessage = (socket, msg) => {
    let dt = new Date();
    let data = {
        id: randomIdGen(socket.id),
        message: msg,
        room: sessionStorage.getItem('id'),
        init: `${dt.getUTCHours()}:${dt.getUTCMinutes()}`,
        sender: sessionStorage.getItem('username'),
        senderID: socket.id,
    }
    socket.emit('chat', data);
}
