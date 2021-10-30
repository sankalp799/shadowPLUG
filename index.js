const http = require('http').createServer;
const express = require('express');
const os = require('os');
const cluster = require('cluster');
const process = require('process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const roomRoute = require('./router/room');
// const mongoose = require('mongoose');
const socketio = require('socket.io');
const cors = require('cors');
const indexRoute = require('./router/index'); 
const logger = require('./.lib/logger');
const helper = require('./.lib/dev');
// const bodyParser = require('body-parser');

let app = express();
let server = http(app);
let CPUs = os.cpus().length;
let io = socketio(server);

app.set('views', './template');
app.set('view engine', 'pug');
app.set('socketio', io);

/*
io.on('connection', (socket) => {
    io.on('disconnect', (socket) => {

    })
});
*/


// express middleware
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.json({ limit: '100mb' }));
app.use(logger);
app.use('/api/v1/room', roomRoute);
app.use('/', indexRoute);

app.use((req, res, next) => {
    res.redirect('/404');
    // res.status(404).json({ok: false, message: '404 Not Found'});
});


if(cluster.isMaster) {
    console.log(`Primary ${process.pid} is running`);
    for(let core=0; core<CPUs; core++){
        cluster.fork();
    }

    cluster.on('exit', (worder, code, signal) => {
        console.log(`[CLUSTER] worker ${worder.process.pid} died`);
        cluster.fork();
    })
}else{
    server.listen(process.env.PROT || 3000, err => {
        !err ? console.log(`Listening to port: ${process.env.PORT || 3000} & ProcessID: ${process.pid}`) : console.log(`[ERROR] ${err.message}`);
        
        setTimeout(helper.roomRenewWorker, 3000);
    });
}
