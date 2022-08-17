const TelnetInput = require("telnet-stream").TelnetInput;
const TelnetOutput = require("telnet-stream").TelnetOutput;
const net = require("net");
class BaseConnector {
    constructor(ioSocket) {
        this.ioSocket = ioSocket;
        this.host = "127.0.0.1";
        this.port = 27;
        this.game = null;
    }

    connect(gameKey) {
        const telnetInput = (this.telnetInput = new TelnetInput());
        const telnetOutput = (this.telnetOutput = new TelnetOutput());

        let telnetSocket = (this.telnetSocket = net
            .createConnection(this.port, this.host)
            .setKeepAlive(true)
            .setNoDelay(true));

        telnetSocket.pipe(telnetInput);
        telnetOutput.pipe(telnetSocket);

        // Management Events
        telnetSocket.on("connect", () => {
            this.game = gameKey;
            this.onConnect(gameKey);
        });

        telnetSocket.on("close", () => {
            this.game = null;
            this.onClose();
        });

        // App Events: Send
        this.writeDo = (option) => {
            telnetOutput.writeDo(option);
        };

        this.writeDont = (option) => {
            telnetOutput.writeDont(option);
        };

        this.writeWill = (option) => {
            telnetOutput.writeWill(option);
        };

        this.writeWont = (option) => {
            telnetOutput.writeWont(option);
        };

        this.writeSub = (option, buffer) => {
            telnetOutput.writeSub(option, buffer);
        };

        this.writeCommand = (option) => {
            telnetOutput.writeCommand(option);
        };

        // App Events: Received
        telnetInput.on("data", (data) => {
            const ansiData = data.toString("utf8");
            this.onReceivedData(ansiData, this.ioSocket);
        });

        telnetInput.on("command", (command) => {
            this.onCommand(command);
        });

        telnetInput.on("do", (option) => {
            this.onDo(option);
        });

        telnetInput.on("dont", (option) => {
            this.onDont(option);
        });

        telnetInput.on("will", (option) => {
            this.onWill(option);
        });

        telnetInput.on("wont", (option) => {
            this.onWont(option);
        });

        telnetInput.on("sub", (option, buffer) => {
            this.onSub(option, buffer);
        });

        // Socket IO Events
        this.ioSocket.on("write", (data) => {
            this.onWrite(data);
        });

        this.ioSocket.on("close", () => telnetSocket.destroy());
    }

    onConnect(gameKey) {
        console.log("[BaseConnector] Socket Connected");
        this.ioSocket.emit("connected", gameKey);
    }
    onClose() {
        console.log("[BaseConnector] Socket Disconnected");
        this.ioSocket.emit("buffer", "Socket Disconnected");
        this.ioSocket.emit("disconnected");
    }

    onReceivedData(data) {
        console.log("[BaseConnector] Received Data");
        this.ioSocket.emit("buffer", data);
    }

    onWrite(data) {
        console.log(`[BaseConnector] Wrote: "${data}"`);
        this.telnetOutput.write(data + "\n", "utf8");
    }

    // Events
    onCommand(command) {
        console.log(`[BaseConnector] Event: COMMAND ${command}`);
    }

    onDo(option) {
        console.log(`[BaseConnector] Event: DO ${option}`);
    }

    onDont(option) {
        console.log(`[BaseConnector] Event: DONT ${option}`);
    }

    onWill(option) {
        console.log(`[BaseConnector] Event: WILL ${option}`);
    }

    onWont(option) {
        console.log(`[BaseConnector] Event: wONT ${option}`);
    }

    onSub(option, buffer) {
        console.log(
            `[BaseConnector] Event: SUB ${option} [DATA]:: ${buffer.toString(
                "utf8"
            )}`
        );
    }
}

module.exports = BaseConnector;
