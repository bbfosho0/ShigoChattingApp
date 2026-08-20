const nodemailer = require("nodemailer");

let transporter;
let transporterFingerprint;

function requiredEnv(env, name) {
  const value = env[name];
  if (!value) throw new Error(`Missing required email configuration: ${name}`);
  return value;
}

function buildSmtpConfig(env = process.env) {
  return {
    host: requiredEnv(env, "SMTP_HOST"),
    port: Number(requiredEnv(env, "SMTP_PORT")),
    secure: String(env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: requiredEnv(env, "SMTP_USER"),
      pass: requiredEnv(env, "SMTP_PASS"),
    },
  };
}

function getTransporter(env = process.env) {
  const config = buildSmtpConfig(env);
  const fingerprint = JSON.stringify(config);

  if (!transporter || fingerprint !== transporterFingerprint) {
    transporter = nodemailer.createTransport(config);
    transporterFingerprint = fingerprint;
  }

  return transporter;
}

function buildPasswordResetMessage(to, resetUrl, env = process.env) {
  const from = requiredEnv(env, "SMTP_FROM");
  return {
    from,
    to,
    subject: "Reset your ShigoChat password",
    text: [
      "A password reset was requested for your ShigoChat account.",
      "",
      `Recovery link: ${resetUrl}`,
      "",
      "This link expires in 30 minutes and can only be used once.",
      "If you did not request this, you can ignore this message.",
    ].join("\n"),
  };
}

function buildPasswordChangedMessage(to, env = process.env) {
  const from = requiredEnv(env, "SMTP_FROM");
  return {
    from,
    to,
    subject: "Your ShigoChat password was changed",
    text: [
      "Your ShigoChat password was changed.",
      "",
      "If you made this change, no further action is needed.",
      "If you did not make this change, request a new password reset immediately.",
    ].join("\n"),
  };
}

async function sendPasswordResetEmail(to, resetUrl, env = process.env) {
  await getTransporter(env).sendMail(buildPasswordResetMessage(to, resetUrl, env));
}

async function sendPasswordChangedEmail(to, env = process.env) {
  await getTransporter(env).sendMail(buildPasswordChangedMessage(to, env));
}

module.exports = {
  buildSmtpConfig,
  buildPasswordResetMessage,
  buildPasswordChangedMessage,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
};
