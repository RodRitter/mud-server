const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

const ProcRealmsConnector = require("./src/connectors/ProcRealmsConnector");

const Games = {
    "procedural-realms": ProcRealmsConnector,
};

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (ioSocket) => {
    console.log("IO User Connected");

    ioSocket.on("connect-game", (gameKey) => {
        const Game = Games[gameKey];
        if (Game) {
            const telnet = new Game(ioSocket);
            telnet.connect(gameKey);
        } else {
            ioSocket.emit("error", {
                key: "non-game",
                message: `Trying to connect to non-existant game: "${gameKey}"`,
                data: { games: Object.keys(Games) },
            });
        }
    });
});

server.listen(3001, () => {
    console.log("listening on *:3001");
});