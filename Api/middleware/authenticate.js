import  jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET_KEY = process.env.SECRET_KEY;

function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      message: "Invalid token - missing token",
    });
  }

  const tokenWithoutBearer = token.split(" ")[1];

  // Verify token
  jwt.verify(tokenWithoutBearer, SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    // Set the decoded token on the response object
    res.decoded = decoded;

    // Proceed to the next middleware
    next();
  });
}

export default authenticate;