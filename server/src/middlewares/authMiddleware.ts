import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';

// Extend the Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// (verify JWT)
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // --- IMPORTANT CHANGE HERE: Check for token in cookies FIRST ---
  if (req.cookies && req.cookies.token) { // Assuming your cookie is named 'token'
    token = req.cookies.token;
    console.log("Backend: Token found in cookie."); // Debug log
  }
  // --- END IMPORTANT CHANGE ---

  // Fallback: Check for token in Authorization header (Bearer token)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log("Backend: Token found in Authorization header."); // Debug log
  }

  if (!token) {
    console.log("Backend: No token found. Sending 401."); // Debug log
    return res.status(401).json({ message: 'Not authorized, no token' }); // Use return to stop execution
  }

  try {
    // Get token from header (if it was found there) or from cookie
    // token is already defined from the checks above

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      // It's good you have this check!
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const decoded = jwt.verify(token, jwtSecret) as { id: string; role: UserRole };
    console.log("Backend: Decoded Token ID:", decoded.id, "Role:", decoded.role); // Debug log

    // Attach user to the request object (excluding password for security)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log("Backend: User not found from token ID. Sending 401."); // Debug log
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    console.log("Backend: Authentication successful for user:", req.user.username, "Role:", req.user.role); // Debug log
    next(); // Proceed to the next middleware/route handler
  } catch (error: any) {
    console.error('Backend: Token verification failed:', error.message); // Debug log
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware for role-based authorization (no changes needed here, as it relies on req.user from protect)
export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated and has one of the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user?.role || 'none'}' is not authorized to access this route` });
    }
    next();
  };
};