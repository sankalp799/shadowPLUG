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
    socket.on('user_list', data => console.log(data));
    socket.on('chat', data => console.log(data));
})

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
        init: `${dt.getUTCHours()}:${dt.getUTCMinutes()}`,
        sender: sessionStorage.getItem('username'),
        senderID: socket.id,
    }
    socket.emit('chat', data);
}
