const http = require("https");

function request(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, function (res) {
      const chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        resolve(body.toString());
      });

      res.on("error", reject);
    });

    if (options.body) {
      req.write(
        typeof options.body === "object"
          ? JSON.stringify(options.body)
          : options.body
      );
    }

    req.end();
  });
}

module.exports = { request };
