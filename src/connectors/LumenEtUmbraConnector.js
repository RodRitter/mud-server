const BaseConnector = require("../BaseConnector");
var AnsiToHtmlConverter = require("ansi-to-html");
var convert = new AnsiToHtmlConverter();

class LumenEtUmbraConnector extends BaseConnector {
    constructor(ioSocket) {
        super(ioSocket);
        this.host = "178.128.248.52";
        this.port = 6667;
    }

    onSub(option, buffer) {
        const buffStr = buffer.toString("utf8");
        const gmcp = buffStr.trim().match(/^(\w+\.\w+)\s({.+})$/);

        // console.log(gmcp);
        if (buffStr && gmcp) {
            const key = gmcp[1];
            const data = gmcp[2];

            if (key && data) {
                this.ioSocket.emit(`gmcp`, {
                    key,
                    data: data,
                });
            }

            // this.ioSocket.emit(`gmcp`, {
            //     key,
            //     data: JSON.parse(data),
            // });
        }
    }

    onReceivedData(ansiData, ioSocket) {
        const formatted = ansiData.replace(/(?:\r\n|\r|\n){3}/g, "<br>");
        const html = convert.toHtml(formatted);
        this.ioSocket.emit("buffer", html);
    }

    onWill(option) {
        super.onWill(option);
        if (option === 201) {
            this.writeSub(
                201,
                Buffer.from(`Core.Hello {"Client":"Grimoire","Version":"1.0"}`)
            );
            return this.writeDo(201);
        }
    }

    onDo(option) {
        super.onDo(option);
    }
}

module.exports = LumenEtUmbraConnector;
