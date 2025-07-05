const { Server } = require('socket.io');
let onlineUsers = new Map();
const User = require('./models/User');

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('userOnline', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));
    });

    socket.on('sendMessage', (data) => {
      const receiverSocket = onlineUsers.get(data.receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit('receiveMessage', data);
      }
    });

   socket.on('disconnect', async () => {
  for (let [userId, sockId] of onlineUsers) {
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
