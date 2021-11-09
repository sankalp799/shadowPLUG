const moment = require('moment');

module.exports = class Peer{
    constructor(username, avatar){
        this.username = username;
        this.avatar = avatar;
        this.id = null;
        this.joinedAt = moment().format('LT');
    };
};
