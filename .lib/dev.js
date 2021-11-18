const fs = require('fs');
const path = require('path');
let dev = {};
dev.data = {};
dev.data.baseDir = path.join(__dirname, '../.data/rooms/');

dev.log = async (head, msg) => {
    await console.log(head + msg);    
}


dev.data.create = (room, callback) => {
    fs.open(dev.data.baseDir + room.id + '.json', 'wx', (error, fileDescriptor) => {
        if(!error && fileDescriptor){
            try{
                let roomString = JSON.stringify(room, null, 2);
               
                fs.writeFile(fileDescriptor, roomString, err => {
                    if(!err){
                        fs.close(fileDescriptor, err => {
                            if(!err){
                                callback(false, {
                                    id: room.id,
                                    link: room.link
                                });
                            }else{
                                callback(err);
                            }
                        });
                    }else{
                        callback(err);
                    }
                })
            }catch(e){
                callback(e);
            }
        }else{
            callback(error);
        }
    })
}


// dev.roomRenewWorker();

dev.data.find = (id, callback) => {
    fs.exists(dev.data.baseDir + id + '.json', callback);
}

// dev.data.find('123-321', (exist) => exist ? console.log(1) : console.log(0));


dev.data.getRoom = (id, callback) => {
    fs.readFile(dev.data.baseDir + id + '.json', (err, data) => {
        if(!err && data){
            try{
                let room = JSON.parse(data);
                callback(false, room);
            }catch(e){
                callback(e);
                console.log(`[ERROR] failed to fetch room data - ${e.message}`);
            }
        }else{
            callback(err);
        }
    })
}

dev.data.updateRoom = (roomData, callback) => {
    let roomStr = JSON.stringify(roomData, null, 2);
    fs.writeFile(dev.data.baseDir + roomData.id + '.json', roomStr, (error) => {
        if(!error){
            callback(false);
        }else{
            console.log(`[ERROR] failed to update file ${room.id}`);
            callback(error);
        }
    })
}


let renewRoom = async (r) => {
    try{
        dev.data.getRoom(r, (err, data) => {
            if(!err && data){
                let extend = (Date.now() - data.createdAt) < (60 * 60 * 1000);
                console.log('WORKER> ', extend);
                if(extend && data.users.length > 0){
                    dev.log('WORKER> ', `${data.id}.json verified`);
                }else if(data.users.length > 0 && !extend){
                    // extend time
                    data.createdAt = Date.now();
                    dev.data.updateRoom(data, (err) => {
                        !err ? dev.log('WORKER> ', `${data.id}.json extended successfully`) : setTimeout(() => renewRoom(r), 10 * 1000);
                    });
                }else{
                    // else remove 
                    fs.unlink(dev.data.baseDir + r + '.json', (done) => {
                        // console.log(done);
                        !done ? dev.log('WORKER> ', `${r}.json expired and removed.`) : dev.log('WORKER> ', `${r}.json go expired but, failed to remove file`); 
                    })
                }
            }else{
                dev.log('WORDER> ', 'failed to get room data from ' + r + '.json');
            }
        }) 
    }catch(e){
        console.log(`[ERROR] ${e}`)
    }
} 

// renewRoom('b352a158-54a2-4f1d-8602-efce626443c7');

dev.roomRenewWorker = async () => {
    setInterval(async () => {
        dev.log('WORDER> ', 'File Inspection Started');
        try{
            await fs.readdir(dev.data.baseDir, async (err, data) => { 
                if(!err && data){
                    // console.log(data);
                    data.forEach((f) => {
                        let id = f.toString().split('.')[0];
                        renewRoom(id);
                    });
                }else{ 
                    console.log('[ERROR] Failed fetch rooms from dir');
                    console.error(err);
                }
            })
        }catch(e){
            console.log(`[ERROR] ${e}`);
        }
    }, 1 * 60 * 1000);

}

module.exports = dev;
