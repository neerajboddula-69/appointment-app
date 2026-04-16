import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("Email notifications are disabled because SMTP credentials are missing in server/.env.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
}

export async function sendEmailNotification(customer, { subject, emailMessage }) {
  const smtp = getTransporter();
  if (!smtp || !customer?.email) {
    if (!customer?.email) {
      console.warn("Email notification skipped because the customer does not have a registered email address.");
    }
    return false;
  }

  try {
    await smtp.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: customer.email,
      subject,
      text: emailMessage
    });

    console.log(`Email notification sent to ${customer.email}.`);
    return true;
  } catch (error) {
    console.error(`Email notification failed for ${customer.email}: ${error.message}`);
    return false;
  }
}

export async function sendBookingNotifications(customer, payload) {
  try {
    await sendEmailNotification(customer, payload);
  } catch {
  }
}
