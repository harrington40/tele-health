import nodemailer from 'nodemailer';
import { config } from '../config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter with SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  /**
   * Send email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"${config.email.fromName}" <${config.email.from}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send verification code email
   */
  async sendVerificationCode(email: string, code: string, type: 'registration' | 'login'): Promise<void> {
    const subject = type === 'registration' 
      ? 'Verify Your TeleHealth Account' 
      : 'Your TeleHealth Login Verification Code';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .code-box { background-color: #fff; border: 2px solid #1976d2; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1976d2; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 TeleHealth Portal</h1>
          </div>
          <div class="content">
            <h2>${type === 'registration' ? 'Welcome to TeleHealth!' : 'Login Verification'}</h2>
            <p>${type === 'registration' 
              ? 'Thank you for registering with TeleHealth. To complete your registration and secure your account, please use the verification code below:' 
              : 'We detected a login attempt to your TeleHealth account. Please use the verification code below to complete your login:'}</p>
            
            <div class="code-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Your Verification Code</p>
              <div class="code">${code}</div>
              <p style="margin: 0; font-size: 12px; color: #999;">Valid for 15 minutes</p>
            </div>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0;">
                <li>This code will expire in <strong>15 minutes</strong></li>
                <li>Never share this code with anyone</li>
                <li>TeleHealth staff will never ask for your verification code</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
            </div>

            ${type === 'registration' ? `
              <p><strong>What's next?</strong></p>
              <ol>
                <li>Enter the 7-digit code in the verification screen</li>
                <li>Complete your profile setup</li>
                <li>Start booking appointments with healthcare providers</li>
              </ol>
            ` : ''}

            <p>If you have any questions or concerns, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TeleHealth Portal. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({ to: email, subject, html });
  }

  /**
   * Send logout notification
   */
  async sendLogoutNotification(email: string, userName: string, deviceInfo: string): Promise<void> {
    const subject = 'TeleHealth Account Logout Notification';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .info-box { background-color: #fff; border-left: 4px solid #1976d2; padding: 15px; margin: 20px 0; }
          .warning { background-color: #ffebee; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 TeleHealth Portal</h1>
          </div>
          <div class="content">
            <h2>Account Logout Notification</h2>
            <p>Hello ${userName},</p>
            <p>We're writing to inform you that your TeleHealth account was logged out.</p>
            
            <div class="info-box">
              <strong>Session Details:</strong>
              <ul style="margin: 10px 0;">
                <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { 
                  dateStyle: 'full', 
                  timeStyle: 'long' 
                })}</li>
                <li><strong>Device/Browser:</strong> ${deviceInfo}</li>
              </ul>
            </div>

            <div class="warning">
              <strong>⚠️ Security Alert:</strong>
              <p style="margin: 10px 0;">If you did not perform this logout action, your account may be compromised. Please:</p>
              <ol style="margin: 10px 0;">
                <li>Change your password immediately</li>
                <li>Review your recent account activity</li>
                <li>Contact our support team if you notice suspicious activity</li>
              </ol>
            </div>

            <p>For your security, we recommend:</p>
            <ul>
              <li>Using a strong, unique password</li>
              <li>Enabling two-factor authentication</li>
              <li>Logging out from shared devices</li>
              <li>Keeping your browser and device updated</li>
            </ul>

            <p>If you have any questions or concerns, please contact our support team immediately.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TeleHealth Portal. All rights reserved.</p>
            <p>This is an automated security notification.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({ to: email, subject, html });
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    const subject = 'Welcome to TeleHealth - Your Account is Active!';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4caf50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .feature-box { background-color: #fff; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #4caf50; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to TeleHealth!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Congratulations! Your TeleHealth account has been successfully verified and activated.</p>
            
            <h3>🏥 What you can do now:</h3>
            
            <div class="feature-box">
              <strong>📅 Book Appointments</strong>
              <p style="margin: 5px 0;">Schedule video consultations with licensed healthcare providers</p>
            </div>

            <div class="feature-box">
              <strong>💊 Prescription Refills</strong>
              <p style="margin: 5px 0;">Request prescription refills and manage your medications</p>
            </div>

            <div class="feature-box">
              <strong>📱 24/7 Access</strong>
              <p style="margin: 5px 0;">Access your health records and consult with doctors anytime</p>
            </div>

            <div class="feature-box">
              <strong>🔒 Secure & Private</strong>
              <p style="margin: 5px 0;">Your health data is protected with bank-level encryption</p>
            </div>

            <p><strong>Need help getting started?</strong></p>
            <p>Visit our Help Center or contact our support team at support@telehealth.com</p>

            <p>Thank you for choosing TeleHealth for your healthcare needs!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TeleHealth Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({ to: email, subject, html });
  }
}

export default new EmailService();
