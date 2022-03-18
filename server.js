const fs = require("fs");
const http = require("http");

const config = require("./config.json");
const webSocket = require("./utils/websocket");

const server = http.createServer((req, res) => {
  fs.readFile(`./public/${req.url.slice(1) || "index"}.html`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(data.toString());
  });
});

webSocket.init(server);

server.listen(config.port, config.hostname, () =>
  console.info(`Server running at http://${config.hostname}:${config.port}`)
);
