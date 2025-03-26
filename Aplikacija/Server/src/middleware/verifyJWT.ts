import { RequestHandler } from 'express';
import env from '../config/validateEnv';
import jwt, { JwtPayload } from 'jsonwebtoken';

const verifyJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });
  //  [0]     [1]
  // 'Bearer token'
  const token = authHeader.split(' ')[1];
  jwt.verify(token, env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.body = (decoded as JwtPayload).UserInfo;
    next();
  });
};

export default verifyJWT;
