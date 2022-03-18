const WebSocket = require("ws");

const config = require("../config.json");
const bot = require("./bot");

let buzzedBy;
const sockets = {};

const actions = {
  restrictions: {
    loggedIn: ["buzz"],
    admin: ["join", "leave", "play", "pause", "resume", "stop", "reset"],
  },
  login(socketId, message) {
    if (message.type === "admin") {
      message.admin = message.password === config.adminPassword;
      delete message.password;

      if (!message.admin) {
        console.info("invalid admin password: ", socketId, message);
        sockets[socketId].close();
        return;
      }
    }

    if (!message.admin && !message?.name) {
      console.warn(`socket ${socketId} tried to login without name`);
      socket[socketId].close();
      return;
    }

    if (buzzedBy) {
      sockets[socketId].send(
        JSON.stringify({
          action: "buzzed",
          by: buzzedBy,
        })
      );
    }

    sockets[socketId].user = message;
    console.info("socket logged in: ", socketId, message);
  },
  buzz(socketId) {
    if (!buzzedBy) {
      buzzedBy = sockets[socketId].user?.name;
      bot.pause();
      sendMessage(
        Object.keys(sockets),
        JSON.stringify({
          action: "buzzed",
          by: buzzedBy,
        })
      );
    }
  },
  join(socketId, message) {
    bot.join(message.channelId);
  },
  leave(socketId) {
    bot.leave();
  },
  play(socketId, message) {
    bot.play(message.song);
  },
  pause(socketId) {
    bot.pause();
  },
  resume(socketId) {
    bot.resume();
  },
  stop(socketId) {
    bot.stop();
  },
  reset(socketId) {
    buzzedBy = undefined;
    bot.resume();
    sendMessage(Object.keys(sockets), '{"action": "reset"}');
  },
};

function init(server) {
  const ws = new WebSocket.Server({ clientTracking: false, noServer: true });

  server.on("upgrade", (req, socket, head) => {
    ws.handleUpgrade(req, socket, head, (socket) => {
      ws.emit("connection", socket);
    });
  });

  ws.on("connection", (socket) => {
    const id = Math.random().toString(36).slice(2);

    sockets[id] = socket;

    socket.on("message", (data) => {
      try {
        const json = JSON.parse(data);

        if (actions.restrictions.loggedIn[json.action] && !socket.user) {
          console.warn(
            `socket ${id} tried "${json.action}" while not logged in`
          );
          return;
        }

        if (
          actions.restrictions.admin[json.action] &&
          socket.user?.type !== "admin"
        ) {
          console.warn(`socket ${id} tried "${json.action}" and is not admin`);
          return;
        }

        if (actions[json.action]) {
          actions[json.action](id, json);
        } else {
          console.error(
            `message type not recognized: ${data} (by socket ${id})`
          );
        }
      } catch (err) {
        console.error(`invalid message: ${data} (by socket ${id})`, err);
        socket.close();
      }
    });

    socket.on("close", () => {
      console.info("socket disconnected", id, sockets[id].user);
      delete sockets[id];
    });

    console.info("socket connected: ", id);
  });
}

function sendMessage(id, message) {
  if (Array.isArray(id)) {
    for (const socketId of id) {
      sendMessage(socketId, message);
    }
  } else if (sockets[id]) {
    sockets[id].send(message);
  }
}

module.exports = { init, sendMessage };
