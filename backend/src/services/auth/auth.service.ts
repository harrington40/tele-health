// @ts-nocheck
import * as grpc from '@grpc/grpc-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';
import { db } from '../../config/database';
import logger from '../../utils/logger';

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  dateOfBirth: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ValidateTokenRequest {
  token: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface LogoutRequest {
  token: string;
}

export class AuthService {
  static async register(
    call: grpc.ServerUnaryCall<RegisterRequest, any>,
    callback: grpc.sendUnaryData<any>
  ): Promise<void> {
    try {
      const { email, password, firstName, lastName, phone, role, dateOfBirth } = call.request;

      // Check if user already exists
      const existingUser = await db.getConnection()
        .table('users')
        .filter({ email })
        .nth(0)
        .run()
        .catch(() => null);

      if (existingUser) {
        return callback({
          code: grpc.status.ALREADY_EXISTS,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, config.bcrypt.rounds);

      // Create user
      const userId = uuidv4();
      const user = {
        id: userId,
        email,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        phone,
        role: role.toUpperCase(),
        date_of_birth: dateOfBirth,
        is_verified: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        last_login: null
      };

      await db.getConnection()
        .table('users')
        .insert(user)
        .run();

      // Generate JWT token
      // @ts-ignore
      const token = jwt.sign(
        { userId, email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      logger.info(`New user registered: ${email}`);

      callback(null, {
        success: true,
        message: 'User registered successfully',
        userId,
        token
      });

    } catch (error) {
      logger.error('Registration error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  static async login(
    call: grpc.ServerUnaryCall<LoginRequest, any>,
    callback: grpc.sendUnaryData<any>
  ): Promise<void> {
    try {
      const { email, password } = call.request;

      // Find user
      const user = await db.getConnection()
        .table('users')
        .filter({ email })
        .nth(0)
        .run()
        .catch(() => null);

      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return callback({
          code: grpc.status.UNAUTHENTICATED,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      await db.getConnection()
        .table('users')
        .get(user.id)
        .update({ last_login: new Date() })
        .run();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      logger.info(`User logged in: ${email}`);

      callback(null, {
        success: true,
        message: 'Login successful',
        userId: user.id,
        token,
        role: user.role
      });

    } catch (error) {
      logger.error('Login error:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }

  static async validateToken(
    call: grpc.ServerUnaryCall<ValidateTokenRequest, any>,
    callback: grpc.sendUnaryData<any>
  ): Promise<void> {
    try {
      const { token } = call.request;

      const decoded = jwt.verify(token, config.jwt.secret) as any;

      callback(null, {
        valid: true,
        userId: decoded.userId,
        role: decoded.role
      });

    } catch (error) {
      callback(null, {
        valid: false,
        userId: '',
        role: ''
      });
    }
  }

  static async refreshToken(
    call: grpc.ServerUnaryCall<RefreshTokenRequest, any>,
    callback: grpc.sendUnaryData<any>
  ): Promise<void> {
    try {
      const { refreshToken } = call.request;

      // For now, treat refresh token same as access token
      // In production, you'd have separate refresh token logic
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as any;

      // @ts-ignore
      const newToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email, role: decoded.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      callback(null, {
        success: true,
        newToken
      });

    } catch (error) {
      callback({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Invalid refresh token'
      });
    }
  }

  static async logout(
    call: grpc.ServerUnaryCall<LogoutRequest, any>,
    callback: grpc.sendUnaryData<any>
  ): Promise<void> {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, just return success
      callback(null, {
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error'
      });
    }
  }
}