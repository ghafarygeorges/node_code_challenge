const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // get the authorizatoin header value ( jwt in our case )
  const authHeader = req.get("Authorization");
  // if not found throw error
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  // if found, split token and take second part because its format is "Bearer <token>" and we need the token part
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    // decode token using secret code
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  // if decoding fails throw error
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  // if everything works and the user is authenticated, save user data in our request and go to next middleware in line
  req.user = decodedToken._doc;
  next();
};
