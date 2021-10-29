const __room__ = require('../models/room');
const { v4 } = require('uuid');
const helper = require('../.lib/dev');

module.exports.create = (req, res) => {
    try{
        let url = req.protocol + '://' + req.hostname;
        url = typeof(process.env.PORT) !== 'undefined' ? url + process.env.PORT + '/' : url + '/';
        let room = new __room__(v4(), url);
        if(room){
              // create room file
            helper.data.create(room, (err, link) => {
                if(!err && link){
                    res.status(201).json({
                        id: room._id,
                        link: link,
                    })
                }else{
                    console.error(err);
                    res.status(500).json({
                        Error: 'Could not create room please try again',
                    })
                }
            });
        }else{
            // failed to create room
            res.status(500).json({
                Error: 'Server Internal Problem Please Try Again later',
            });
        }
    }catch(err){
        console.error(err);
        res.status(500).json({
            Error: 'Please Try Again later',
        })
    }  
}
