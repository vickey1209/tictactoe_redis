"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
const socketConnection_1 = __importDefault(require("./connection/socketConnection"));
dotenv_1.default.config({ path: './.env' });
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*" },
    transports: ["polling", "websocket"],
    pingInterval: 2000,
    pingTimeout: 2500,
});
exports.io = io;
(0, socketConnection_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "./views")));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./views/game.html"));
});
let port = process.env.PORT || 8009;
// let port=process.argv[2];
httpServer.listen(port, () => {
    logger_1.default.info("server is running on port : ", port);
});
