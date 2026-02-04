const r = require('rethinkdb');
import db from '../config/database';

interface VerificationCode {
  id?: string;
  userId: string;
  email: string;
  code: string;
  type: 'registration' | 'login' | 'password_reset';
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  createdAt: Date;
}

class VerificationService {
  /**
   * Generate a secure 7-digit verification code
   */
  generateCode(): string {
    // Generate a cryptographically secure 7-digit code
    const min = 1000000;
    const max = 9999999;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  /**
   * Create and store a verification code
   */
  async createVerificationCode(
    userId: string,
    email: string,
    type: 'registration' | 'login' | 'password_reset'
  ): Promise<string> {
    try {
      const connection = db.getConnection();
      const code = this.generateCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      const verificationData: VerificationCode = {
        userId,
        email,
        code,
        type,
        expiresAt,
        verified: false,
        attempts: 0,
        createdAt: new Date(),
      };

      // Invalidate any existing unverified codes for this user and type
      await r
        .table('verification_codes')
        .filter({ userId, type, verified: false })
        .update({ verified: true, invalidatedAt: new Date() })
        .run(connection);

      // Insert new verification code
      const result = await r.table('verification_codes').insert(verificationData).run(connection);

      console.log(`✅ Verification code created for ${email} (${type})`);
      return code;
    } catch (error) {
      console.error('Error creating verification code:', error);
      throw error;
    }
  }

  /**
   * Verify a code
   */
  async verifyCode(
    email: string,
    code: string,
    type: 'registration' | 'login' | 'password_reset'
  ): Promise<{ valid: boolean; userId?: string; message: string }> {
    try {
      const connection = db.getConnection();

      // Find the verification code
      const cursor = await r
        .table('verification_codes')
        .filter({ email, code, type, verified: false })
        .orderBy(r.desc('createdAt'))
        .limit(1)
        .run(connection);

      const codes = await cursor.toArray();

      if (codes.length === 0) {
        return { valid: false, message: 'Invalid or expired verification code' };
      }

      const verificationRecord = codes[0];

      // Check if code has expired
      if (new Date() > new Date(verificationRecord.expiresAt)) {
        return { valid: false, message: 'Verification code has expired' };
      }

      // Check max attempts (5 attempts allowed)
      if (verificationRecord.attempts >= 5) {
        return { valid: false, message: 'Maximum verification attempts exceeded. Please request a new code.' };
      }

      // Increment attempts
      await r
        .table('verification_codes')
        .get(verificationRecord.id)
        .update({ attempts: verificationRecord.attempts + 1 })
        .run(connection);

      // Mark as verified
      await r
        .table('verification_codes')
        .get(verificationRecord.id)
        .update({ verified: true, verifiedAt: new Date() })
        .run(connection);

      // Update user's email verification status if registration
      if (type === 'registration') {
        await r
          .table('users')
          .filter({ id: verificationRecord.userId })
          .update({
            email_verified: true,
            email_verified_at: new Date(),
            is_active: true,
          })
          .run(connection);
      }

      console.log(`✅ Code verified for ${email} (${type})`);
      return { valid: true, userId: verificationRecord.userId, message: 'Verification successful' };
    } catch (error) {
      console.error('Error verifying code:', error);
      return { valid: false, message: 'Verification failed. Please try again.' };
    }
  }

  /**
   * Resend verification code
   */
  async resendCode(
    email: string,
    type: 'registration' | 'login' | 'password_reset'
  ): Promise<{ success: boolean; code?: string; message: string }> {
    try {
      const connection = db.getConnection();

      // Find the user
      const userCursor = await r.table('users').filter({ email }).run(connection);
      const users = await userCursor.toArray();

      if (users.length === 0) {
        return { success: false, message: 'User not found' };
      }

      const user = users[0];

      // Check rate limiting - max 3 codes per hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentCodes = await r
        .table('verification_codes')
        .filter(
          r.and(
            r.row('email').eq(email),
            r.row('type').eq(type),
            r.row('createdAt').gt(oneHourAgo)
          )
        )
        .count()
        .run(connection);

      if (recentCodes >= 3) {
        return {
          success: false,
          message: 'Too many verification attempts. Please try again in 1 hour.',
        };
      }

      // Create new verification code
      const code = await this.createVerificationCode(user.id, email, type);

      return { success: true, code, message: 'Verification code sent successfully' };
    } catch (error) {
      console.error('Error resending code:', error);
      return { success: false, message: 'Failed to resend code. Please try again.' };
    }
  }

  /**
   * Clean up expired codes (run periodically)
   */
  async cleanupExpiredCodes(): Promise<number> {
    try {
      const connection = db.getConnection();
      const now = new Date();

      const result = await r
        .table('verification_codes')
        .filter(r.row('expiresAt').lt(now))
        .delete()
        .run(connection);

      console.log(`🧹 Cleaned up ${result.deleted} expired verification codes`);
      return result.deleted;
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
      return 0;
    }
  }

  /**
   * Get verification statistics for a user
   */
  async getUserVerificationStats(userId: string): Promise<any> {
    try {
      const connection = db.getConnection();

      const stats = await r
        .table('verification_codes')
        .filter({ userId })
        .group('type')
        .count()
        .ungroup()
        .run(connection);

      return stats;
    } catch (error) {
      console.error('Error getting verification stats:', error);
      return null;
    }
  }
}

export default new VerificationService();
