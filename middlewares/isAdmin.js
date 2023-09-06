const isAdmin = function (req, res, next) {
    if (req.payload.role === "admin") {
      next();
    } else {
      return
    }
  }

  module.exports = isAdmin