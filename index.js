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
    // Fetch game data
    const telnet = new TestConnector(ioSocket);
    telnet.connect("Test Game Key");
});

const PORT = 5555;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
