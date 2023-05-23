const notification = require("./models/notification");
const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST"],
    httpOnly: false,
    credentials: false,
  },
});
server.listen(3001);

exports.noti = function (req, res) {
  let notificat = new notification({
    Title: req.Title,
    Description: req.Description,
    product_id: req.product_id,
    role: req.role,
    seenby: [],
    store_id: req.store_id,
  });
  notificat.save();

  io.on("connection", function (socket) {
    console.log("socketid", socket.id);
  });
  io.emit("getnotification", notificat);
};
