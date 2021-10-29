const fs = require('fs');
const path = require('path');
let dev = {};
dev.data = {};

dev.data.create = (room, callback) => {
    let baseDir = path.join(__dirname, '../.data/rooms/');
    fs.open(baseDir + room._id + '.json', 'wx', (error, fileDescriptor) => {
        if(!error && fileDescriptor){
            try{
                let roomString = JSON.stringify(room);
                console.log(roomString);
                fs.writeFile(fileDescriptor, roomString, err => {
                    if(!err){
                        fs.close(fileDescriptor, err => {
                            if(!err){
                                callback(false, room.link);
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
        let dirPath = path.join(__dirname, `../.data/rooms/${r}`);
        await fs.readFile(dirPath, async (err, data) => {
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
                console.log(`[ERROR] ${err.message}`);
            }
        })
    }catch(e){
        console.log(`[ERROR] ${e.message}`)
    }
} 

dev.roomRenewWorker = async () => {
    setInterval(async () => {
        try{
            let baseDir = path.join(__dirname, '../.data/rooms/');
            await fs.readdir(baseDir, async (err, data) => {
                if(!err && data){
                    data.forEach(renewRoom);
                }else{
                    
                    console.log('[ERROR] Failed fetch rooms from dir');
                    console.error(err);
                }
            })
        }catch(e){
            console.log(`[ERROR] ${e.message}`);
        }
    }, 2 * 60 * 1000);

}

// dev.roomRenewWorker();

dev.data.find = (id, callback) => {
    let baseDir = path.join(__dirname, '../.data/rooms/');
    fs.exists(baseDir + id + '.json', callback);
}

// dev.data.find('123-321', (exist) => exist ? console.log(1) : console.log(0));


module.exports = dev;
