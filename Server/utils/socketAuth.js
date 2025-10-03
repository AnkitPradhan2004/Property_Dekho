const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authenticateSocket(socket, next) {
  try {
    // token may come via query param or auth header in socket.handshake
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      const err = new Error("Authentication error: token missing");
      err.data = { code: "TOKEN_MISSING" };
      return next(err);
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      const err = new Error("Authentication error: user not found");
      err.data = { code: "USER_NOT_FOUND" };
      return next(err);
    }
    if (user.status === "blocked") {
      const err = new Error("Authentication error: user blocked");
      err.data = { code: "USER_BLOCKED" };
      return next(err);
    }
    socket.user = user; // attach user to socket
    return next();
  } catch (err) {
    const e = new Error("Authentication error: invalid token");
    e.data = { code: "INVALID_TOKEN", message: err.message };
    return next(e);
  }
}

module.exports = authenticateSocket;
