const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const server = http.createServer(app);

const TestConnector = require("./src/connectors/TestConnector");

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (ioSocket) => {
    console.log("IO User Connected");
    io.emit("socket-connected");
    const telnet = new TestConnector(ioSocket);

    ioSocket.on("game-connect", ({ host, port, name }) => {
        telnet.connect(host, port, name);
    });
});

const PORT = 5555;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
