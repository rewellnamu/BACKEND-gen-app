const { Server } = require('socket.io');
const User = require('./models/User');

let onlineUsers = new Map();

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    socket.on('userOnline', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });

    socket.on('sendMessage', (data) => {
      const receiverSocket = onlineUsers.get(data.receiver);
      if (receiverSocket) {
        io.to(receiverSocket).emit('receiveMessage', data);
      }
    });

    socket.on('disconnect', async () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
          break;
        }
      }
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });
  });
};
