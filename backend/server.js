require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const initSocketServer = require("./src/sockets/socket.server");

const httpServer = require("http").createServer(app);

const port = process.env.PORT || 3000;

initSocketServer(httpServer);

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

connectDB();
