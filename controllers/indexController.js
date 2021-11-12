const _config = require('../.lib/config');
const helper = require('../.lib/dev');
const bodyParser = require('body-parser');
let formBodyParser = bodyParser.urlencoded({ extended:true });
const Peer = require('../models/user');

module.exports.home = (req, res) => {
res.status(200).render('index', {
    title: _config.title,
    header: 'Create Room',
    })
}

module.exports.notFound = (req, res) => {
    // let message = typeof(req.data.error) == 'string' && req.data.error.trim().length > 0 ? req.data.error : 'Not Found';
    res.status(404).render('404', {
        message: 'Not Found',
        title: _config.title, 
    });
}

module.exports.join = (req, res) => {
    // check for room exist or not
    console.log(`[ROOM] USER REQUEST FOR ${req.params.id}`);
    let err = typeof(req.app.get('Error')) == 'string' ? req.app.get('Error') : '';
    helper.data.find(req.params.id, found => {
        console.log(found);
        if(found){
            res.status(200).render('join', {
                Error: err,
                id: req.params.id,
                title: _config.title,
                header: 'Join',
            })
        }else{
            res.status(404).redirect('/404');
        }
    })
}


module.exports.directRoom = (req, res) => {
    helper.log('[ROUTE]', `redirected user to ${req.params.id}`);
    res.redirect(`/join/${req.params.id}`);
}


module.exports.getRoom = (req, res) => {
    let username = typeof(req.body.username) == 'string' && req.body.username.trim().length > 0 ? req.body.username.trim() : false;
    let id = req.params.id;
     
    // console.log(req.body); 
    if(username){
        helper.data.getRoom(id, (err, room) => {
            if(!err && room){
                room.users.push(new Peer(username, undefined));
                helper.data.updateRoom(room, (error) => {
                    if(!error){
                        res.status(200).render('chat', {
                            title: _config.title,
                            users: room.users,
                            username: username,
                        })      
                    }else{
                        console.log(error);
                        res.status(500).send('server internal problem');
                    }
                })
            }else{
                console.log(err);
                res.status(500).send('server internal problem');
            }
        }) 
    }else{
        req.app.set('Error', 'Try With Another Username Please')
        res.status(400).redirect(`/join/${id}`);
    }
}

