const __room__ = require('../models/room');
const { v4 } = require('uuid');
const helper = require('../.lib/dev');

module.exports.create = (req, res) => {
    try{
        let url = req.protocol + '://' + req.hostname;
        url = typeof(process.env.PORT) !== 'undefined' ? url + process.env.PORT + '/' : url + '/';
        helper.data.create(new __room__(v4(), url), (err, link) => {
            if(!err && link){
                res.status(201).json(link);
            }else{
                res.status(500).json({
                    Error: 'Something went wrong please try again',
                });
            }
        })
    }catch(err){
        console.error(err);
        res.status(500).json({
            Error: 'Please Try Again later',
        })
    }  
}
