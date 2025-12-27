import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Allow OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') {
      return next();
    }

    // Exclude auth routes
    if (req.path.startsWith('/auth/login') || req.path.startsWith('/auth/register')) {
      return next();
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify token and attach user info to request
      const decoded = this.authService.verifyToken(token);
      (req as any).user = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

