const BaseConnector = require("../BaseConnector");
var AnsiToHtmlConverter = require("ansi-to-html");
var convert = new AnsiToHtmlConverter();
var convertToHTML = require("../../lib/ansiToHtml");

class TestConnector extends BaseConnector {
    constructor(ioSocket) {
        super(ioSocket);
    }

    onReceivedData(ansiData, ioSocket) {
        const html = convert.toHtml(ansiData);
        // const html = convertToHTML(ansiData);
        this.ioSocket.emit("buffer", html);
    }
}

module.exports = TestConnector;
