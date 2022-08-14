# tdb

## Usage

```
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

socket.emit("connect-game", "game-name");

socket.on("connected", () => {
    socket.on("disconnected", () => {
        console.log("disconnected");
    });

    socket.on("buffer", (line) => {
        // Add line to list of text to display
    });

    socket.on("gmcp", (data) => {
        // Do something with data - Make a health bar or something
    });

    socket.on("error", (error) => {
        console.error(`Error: ${error.message}`, error.key, error.data);
    });
});
```

## Events

### Sent by Client

```
socket.emit("connect-game", "game-name"); // Connect the socket for an existing game on the server
socket.emit("write", "equip sword"); // Send a command
socket.emit("close"); // Close the socket
```

### Events: Received by Client

```
socket.on("connected", () => {}); // When a game has successfully connected
socket.on("disconnected", () => {}); // When a game has disconnected
socket.on("buffer", (line) => {}); // When a line of text is received (Formatted from ANSI to HTML)
socket.on("gmcp", (data) => {}); // When GMCP data is received
socket.on("error", (error) => {}); // When an error is sent by the server
```
