module.exports = class Room{
    constructor(id, url){
        this.id = id;
        this.link = url + id;
        this.createAt = Date.now();
        this.users = [];
    };
};
