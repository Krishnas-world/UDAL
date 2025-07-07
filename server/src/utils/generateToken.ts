import jwt from 'jsonwebtoken';

const generateToken = (id: string, role: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id, role }, jwtSecret, {
    expiresIn: '24h', 
  });
};

export default generateToken;