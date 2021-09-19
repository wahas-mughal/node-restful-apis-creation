const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //get the token from the headers
    const TOKEN = req.headers.authorization.split(" ")[1];
    console.log(TOKEN);

    const decodedToken = jwt.verify(TOKEN, process.env.JWT_SECRET);
    console.log(decodedToken);
    req.userData = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({
      message: "User is not authorized!",
    });
  }
};
