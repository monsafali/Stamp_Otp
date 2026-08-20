
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

console.log("SMTP configuration:");

console.log({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  passExists: !!process.env.SMTP_PASS,
  passLength: process.env.SMTP_PASS?.length,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  logger: true,
  debug: true,
});

try {
  await transporter.verify();

  console.log("=================================");
  console.log("SMTP CONNECTION SUCCESS");
  console.log("=================================");
} catch (error) {
  console.error("=================================");
  console.error("SMTP ERROR");
  console.error("=================================");
  console.error(error);
}
