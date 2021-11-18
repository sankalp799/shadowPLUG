const moment = require('moment');

module.exports = class Peer{
    constructor(username){
        this.username = username;
        this.avatar = process.env.AVATAR_API + username + '.svg';
        this.id = null;
        this.joinedAt = moment().format('LT');
    };
};
