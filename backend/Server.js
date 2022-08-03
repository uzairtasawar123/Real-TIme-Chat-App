const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const UserRoute = require("./Routes/UserRoutes");
const Message = require("./Models/MessageSchema");
const User = require("./Models/User");

const port = 8001;
dotenv.config();
///////////////////////////   DB Coonnection  ///////////////////////////////
mongoose.connect(process.env.DB_CONNECT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB Connected Successfully");
  }
});
///////////////////////     Rooms   /////////////////////////////////////
const Rooms = ["CS Section A", "PUBG ", "Home", "Village 23", "FYP Group"];
///////////////////////////////////////////////////////////
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//////////////////////////////////////////////////////////
app.use("/user", UserRoute);
//////////////////////////////////////////////////////////
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//////////////////////////////  Function for Getting message from Room   ////////////////////////////
const GetLastMessageFromRoom = async (room) => {
  let Messages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return Messages;
};

////////////////////////   Function for Sorting Messages DateWise   //////////////////

const SortRoomMessagesByDate = (messages) => {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
};

//////////////////////////////////   Socket   ///////////////////////////////////
io.on("connection", (socket) => {
  console.log(`User Connected : ${socket.id}`);

  ///////////////   New User   //////////////////
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });
  ///////////    Joining Room and Returing RoomMessages as Sorted by Date to FrontEnd  //////////
  socket.on("Join_Room", async (room , previousRoom) => {
    socket.join(room);
    socket.leave(previousRoom)
    let roomMessages = await GetLastMessageFromRoom(room);
    roomMessages = await SortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  /////////////////////    Message-Rooms Storing Message to DB and Returning Back   //////////////
  socket.on("Message-Room", async (room, content, sender, time, date) => {
    // console.log('New Message' , content);
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await GetLastMessageFromRoom(room);
    roomMessages = await SortRoomMessagesByDate(roomMessages);
    console.log("Room Messages :" , roomMessages)
    //////////////    Sending Message to Room ////////////////////////
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });

  ///////////////////////   LogOut User API   /////////////////////

  app.delete("/logout", async (req, res) => {
    try {
      const { _id, newMessages } = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.messages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit("new-user", members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send();
    }
  });

  ////////////////////    User disconnected   //////////////////

  socket.on("disconnect", () => {
    console.log(`User Disconnected : ${socket.id}`);
  });
});

//////////////////////////////////////////////////////////
app.get("/rooms", (req, res) => {
  res.json(Rooms);
});

//////////////////////////////////////////////////////////
server.listen(port, () => {
  console.log(`We are listening you at http://localhost:${port}`);
});
