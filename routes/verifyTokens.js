const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token is not valid", error: err.message });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // Check if the user is an admin directly from the decoded JWT
    if (req.user.isAdmin) {
      console.log(req.user);
      next();
    } else {
      res.status(403).json("You are not allowed to do that Admin Only!!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
