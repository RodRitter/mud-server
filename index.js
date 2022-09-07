const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

const ProcRealmsConnector = require("./src/connectors/ProcRealmsConnector");
const LumenEtUmbraConnector = require("./src/connectors/LumenEtUmbraConnector");

const Games = {
    "lumen-et-umbra": LumenEtUmbraConnector,
    "procedural-realms": ProcRealmsConnector,
};

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "https://grimoire-ashen.vercel.app",
    },
});

io.on("connection", (ioSocket) => {
    console.log("IO User Connected");

    ioSocket.on("connect-game", (connectKey) => {
        const Game = Games[connectKey];
        const telnet = new Game(ioSocket);

        if (Game && !telnet.connected) {
            telnet.connect(connectKey);
        } else {
            ioSocket.emit("error", {
                key: "non-game",
                message: `Trying to connect to non-existant game: "${connectKey}"`,
                data: { games: Object.keys(Games) },
            });
        }
    });
});

server.listen(3001, () => {
    console.log("listening on *:3001");
});
