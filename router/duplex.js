let { onConnection, authSocket } = require('../.lib/handler');

module.exports = (conn) => {
    conn.use(authSocket);
    conn.on('connection', (socket) => {
        onConnection(socket, conn);
    });
};
