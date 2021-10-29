module.exports = class Room{
    constructor(id, url){
        this._id = id;
        this.link = url + id;
        this.createAt = Date.now();
        this.chats = [];
        this.users = [];
    };
};
