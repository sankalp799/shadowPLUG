const _config = require('../.lib/config');
const helper = require('../.lib/dev');
const bodyParser = require('body-parser');
let formBodyParser = bodyParser.urlencoded({ extended:true });

module.exports.home = (req, res) => {
res.status(200).render('index', {
    title: _config.title,
    })
}

module.exports.notFound = (req, res) => {
    // let message = typeof(req.data.error) == 'string' && req.data.error.trim().length > 0 ? req.data.error : 'Not Found';
    res.status(404).render('404', {
        message: 'Not Found',
    });
}

module.exports.join = (req, res) => {
    // check for room exist or not
    console.log(`[ROOM] USER REQUEST FOR ${req.params.id}`);
    helper.data.find(req.params.id, (exist) => {
        console.log(exist);
        if(exist){
            res.status(200).render('join', {
                _id: req.params.id,
                Error: '',
            });
        }else{
            // req.data.error = 'Room Not Found';
            res.redirect('/404');
        }
    })    
}


module.exports.directRoom = (req, res) => {
    res.redirect(`/join/${req.params.id}`);
}


module.exports.getRoom = (req, res) => {
    let username = typeof(req.body.username) == 'string' && req.body.username.trim().length > 0 ? req.body.username.trim() : false;
    let id = req.params.id;

    console.log(req.body); 
    if(username){
        helper.data.getRoom(id, (error, room) => {
            // console.log(`[ROOM] data: ${room}`);
            if(!error && room){
                res.render('chat', {
                    users: room.users,
                    chats: room.chats,
                    username: username,
                })
            }else{
                res.status(500).send('Internal Server Problem');
            }
        })   
    }else{
        res.status(400).redirect(`/join/${id}`);
    }
}

