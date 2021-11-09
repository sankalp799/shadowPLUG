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
                let roomString = JSON.stringify(room);
                console.log(roomString);
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

let renewRoom = async (r) => {
    try{
        await fs.readFile(dev.data.baseDir, async (err, data) => {
            if(!err && data){
                let dataStr = JSON.parse(data);
                if((Date.now() - dataStr.createdAt) > (30 * 60 * 1000)){
                    if(dataStr.users.length > 0){
                        //extend by 30 min
                        dataStr.createdAt = Date.now();
                        dataStr = JSON.stringify(dataStr);

                        await fs.writeFile(dirPath, dataStr, async (err) => {
                            if(!err)
                                console.log(`[ROOM] ${r} renewed`);
                            else
                                console.log(`[ROOM] failed to renewed and write ${r}`)
                        })
                    }else{
                        // delete room data
                        await fs.unlink(dirPath, async (err) => {
                            if(!err)
                                console.log(`[ROOM] ${r} deleted`);
                            else
                                console.log(`[ROOM] failed to delete ${r}`);
                        })
                    }    
                }
            }else{
                console.log(`[ERROR] ${err}`);
            }
        })
    }catch(e){
        console.log(`[ERROR] ${e}`)
    }
} 

dev.roomRenewWorker = async () => {
    setInterval(async () => {
        try{
            await fs.readdir(dev.data.baseDir, async (err, data) => {
                
                if(!err && data){
                    data.forEach(renewRoom);
                }else{
                    
                    console.log('[ERROR] Failed fetch rooms from dir');
                    console.error(err);
                }
            })
        }catch(e){
            console.log(`[ERROR] ${e}`);
        }
    }, 2 * 60 * 1000);

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
    let roomStr = JSON.stringify(roomData);
    fs.writeFile(dev.data.baseDir + roomData.id + '.json', roomStr, (error) => {
        if(!error){
            callback(false);
        }else{
            console.log(`[ERROR] failed to update file ${room.id}`);
            callback(error);
        }
    })
}


module.exports = dev;
