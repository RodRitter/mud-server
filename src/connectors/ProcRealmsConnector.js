const BaseConnector = require("../BaseConnector");
var AnsiToHtmlConverter = require("ansi-to-html");
var convert = new AnsiToHtmlConverter();

class ProcRealmsConnector extends BaseConnector {
    constructor(ioSocket) {
        super(ioSocket);
        this.host = "procrealms.ddns.net";
        this.port = 3000;
    }

    onSub(option, buffer) {
        const buffStr = buffer.toString("utf8");
        const gmcp = buffStr.trim().match(/^(\w+\.\w+)\s({.+})$/);

        if (gmcp) {
            const key = gmcp[1];
            const data = gmcp[2];

            this.ioSocket.emit(`gmcp`, {
                key,
                data: JSON.parse(data),
            });
        }
    }

    onReceivedData(ansiData, ioSocket) {
        const html = convert.toHtml(ansiData);
        this.ioSocket.emit("buffer", html);
    }
}

module.exports = ProcRealmsConnector;
