const _config = require('../.lib/config');
const helper = require('../.lib/dev');

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
        if(exist){
            res.render('/join');
        }else{
            // req.data.error = 'Room Not Found';
            res.redirect('/404');
        }
    })    
}
