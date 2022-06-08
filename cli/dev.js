import { transformSync } from "@babel/core";
import express from "express";
import fs from "fs";
import watch from "node-watch";
import path from "path";

import { extractFileType, getFileType } from "./utils";

let markup = "";

const http = require("http");
const { Server } = require("socket.io");

const getHTML = (options) => {
  const { code, name, type } = options;

  // console.log("getHTML", options);

  return `
    <html>
      <head>
        <title>${name} | atwo</title>
        <script src="${type.script}"></script>
        <script src="https://cdn.socket.io/4.5.0/socket.io.min.js" integrity="sha384-7EyYLQZgWBi67fBtVxw60/OWl1kjsfrPFcaU0pp0nAh+i8FD068QogUvg85Ewy1k" crossorigin="anonymous"></script>
      </head>
      <body>
        <script>
          // const socket = io();
          var socket = io('http://localhost:3000');

          socket.on('reload', () => {
            console.log('reload pls');
          })
        </script>
        <script>
          // canvas.js

          // window.state
          window.state = {color: 'teal', size: 150};
        </script>
        <script>
          ${code}
        </script>
      </body>
    </html>
  `;
};

const command = (name, options) => {
  const port = options.port || 3000;
  const filePath = path.join(process.cwd(), name);

  if (!fs.existsSync(filePath)) {
    console.log(`Cannot find file: ${name}. Path: ${filePath}`);
    process.exit(1);
  }

  const fileType = extractFileType(name);
  const fileType2 = getFileType(fileType);
  const server = express();

  // const ioExpress = express();
  const ioServer = http.createServer(server, {
    // cors: {
    //   origin: "https://example.com",
    //   methods: ["GET", "POST"],
    // },
  });
  const io = new Server(ioServer);

  io.on("connection", (socket) => {
    console.log("a user connected");
  });

  // ioServer.listen("8080", () => {
  //   console.log("socket io is the worst");
  // });

  const doTheThing = (cb) => {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const result = transformSync(fileContents);

    markup = getHTML({ code: result.code, name, type: fileType2 });

    if (cb) cb();
  };

  doTheThing();

  watch(filePath, {}, () => {
    doTheThing();
    // send websocket ping
  });

  server.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(markup);
  });

  server.listen(port, () => {
    console.log(`running at 0.0.0.0:${port}, url: http://localhost:${port}`);

    if (options.open) {
      console.log("open the browser");
    }
  });
};

export default command;
