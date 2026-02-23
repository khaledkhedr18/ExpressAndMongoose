import nodemailer from "nodemailer";
import config from "../config/env.js";

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
});

export const sendEmail = async (options: MailOptions): Promise<void> => {
  const mailOptions = {
    from: `"ExpressAndMongoose" <${config.emailFrom}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendPasswordResetOtp = async (
  email: string,
  otp: string,
): Promise<void> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; text-align: center;">Password Reset</h2>
      <p style="color: #555; font-size: 16px;">You requested a password reset. Use the OTP below to verify your identity:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${otp}</span>
      </div>
      <p style="color: #555; font-size: 14px;">This OTP is valid for <strong>${config.otpExpiresMinutes} minutes</strong>.</p>
      <p style="color: #999; font-size: 12px;">If you did not request a password reset, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    html,
    text: `Your password reset OTP is: ${otp}. It is valid for ${config.otpExpiresMinutes} minutes.`,
  });
};
