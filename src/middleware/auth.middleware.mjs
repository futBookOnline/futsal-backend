import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt_login_owner;
  if (!token) return res.status(403).send("Token Is Required");
  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) return res.status(401).send("Invalid Token");
    next();
  });
};
