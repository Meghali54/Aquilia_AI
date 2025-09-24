import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../middleware';
import { storage } from '../storage';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'researcher' | 'policy_user' | 'guest';
  password?: string;
  createdAt: Date | null;
  lastLoginAt?: Date | null;
  isActive?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'researcher' | 'policy_user' | 'guest';
}

export class AuthService {
  
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(config.security.bcryptSaltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      logger.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      logger.error('Error comparing password:', error);
      return false;
    }
  }

  static generateTokens(user: Omit<User, 'password'>): AuthTokens {
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      issuer: 'aquila-marine-platform',
      audience: 'aquila-users'
    } as jwt.SignOptions);

    const refreshToken = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn,
      issuer: 'aquila-marine-platform',
      audience: 'aquila-refresh'
    } as jwt.SignOptions);

    // Calculate expiry time in seconds
    const expiresIn = this.getTokenExpirySeconds(config.jwt.expiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn
    };
  }

  private static getTokenExpirySeconds(expiresIn: string): number {
    // Parse JWT expiry format (e.g., '24h', '7d', '1h')
    const match = expiresIn.match(/^(\d+)([hdm])$/);
    if (!match) return 3600; // Default 1 hour

    const [, value, unit] = match;
    const num = parseInt(value, 10);

    switch (unit) {
      case 'h': return num * 3600;
      case 'd': return num * 24 * 3600;
      case 'm': return num * 60;
      default: return 3600;
    }
  }

  static async login(credentials: LoginRequest): Promise<{
    user: Omit<User, 'password'>;
    tokens: AuthTokens;
  }> {
    try {
      const { email, password, rememberMe } = credentials;

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Note: For now, all users are considered active since isActive is not in storage schema
      // if (!user.isActive) {
      //   throw new Error('Account is deactivated');
      // }

      // Verify password
      const isValidPassword = await this.comparePassword(password, user.password || '');
      if (!isValidPassword) {
        logger.warn(`Failed login attempt for email: ${email}`);
        throw new Error('Invalid credentials');
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Generate tokens
      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'admin' | 'researcher' | 'policy_user' | 'guest',
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        isActive: true // Default to true since not in storage schema
      };

      const tokens = this.generateTokens(userWithoutPassword);

      // Extend refresh token expiry if remember me is checked
      if (rememberMe) {
        const extendedRefreshToken = jwt.sign(
          { userId: user.id },
          config.jwt.secret,
          { expiresIn: '30d' } // 30 days for remember me
        );
        tokens.refreshToken = extendedRefreshToken;
      }

      logger.info(`Successful login for user: ${email} (${user.role})`);

      return {
        user: userWithoutPassword,
        tokens
      };

    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  static async register(userData: RegisterRequest): Promise<{
    user: Omit<User, 'password'>;
    tokens: AuthTokens;
  }> {
    try {
      const { email, password, name, role = 'guest' } = userData;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Validate password strength
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create new user
      const newUserData = {
        email,
        name,
        role,
        password: hashedPassword
      };

      const createdUser = await storage.createUser(newUserData);

      // Generate tokens
      const userWithoutPassword = {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role as 'admin' | 'researcher' | 'policy_user' | 'guest',
        createdAt: createdUser.createdAt,
        lastLoginAt: createdUser.lastLoginAt,
        isActive: true // Default to true since not in storage schema
      };

      const tokens = this.generateTokens(userWithoutPassword);

      logger.info(`New user registered: ${email} (${role})`);

      return {
        user: userWithoutPassword,
        tokens
      };

    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as any;
      
      if (decoded.aud !== 'aquila-refresh') {
        throw new Error('Invalid refresh token');
      }

      // Get user
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'admin' | 'researcher' | 'policy_user' | 'guest',
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        isActive: true // Default to true since not in storage schema
      };

      const tokens = this.generateTokens(userWithoutPassword);

      logger.info(`Token refreshed for user: ${user.email}`);
      return tokens;

    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new Error('Invalid refresh token');
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await this.comparePassword(currentPassword, user.password || '');
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update password
      await storage.updateUserPassword(userId, hashedNewPassword);

      logger.info(`Password changed for user: ${user.email}`);

    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  static async verifyToken(token: string): Promise<Omit<User, 'password'> | null> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      if (decoded.aud !== 'aquila-users') {
        return null;
      }

      const user = await storage.getUser(decoded.user.id);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'admin' | 'researcher' | 'policy_user' | 'guest',
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        isActive: true // Default to true since not in storage schema
      };

    } catch (error) {
      return null;
    }
  }
}