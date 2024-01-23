const socket = require("socket.io");
const Conversation = require("./Database/Conversation");
const appServer = require("./Server");

const io = socket(appServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });

  console.log("users:", users);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log("userId:", userId);
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });



  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
    console.log(conversationId);
    const user = getUser(receiverId);

    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        receiverId,
      });
    } else {
      console.log("User not found", socket.id);
      io.to(socket.id).emit("offline", {
        senderId,
        text,
        conversationId,
        receiverId,
      });
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
