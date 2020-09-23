import handlebar from "handlebars";
import fs from "fs";
import path from "path";
import { createTransport } from "nodemailer";
import { MailerTemplate } from "./mailer-template";
import Mail from "nodemailer/lib/mailer";
import {} from "date-fns";

class Mailer {
  private transporter?: Mail;
  init(password: string, email: string) {
    this.transporter = createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async send(type: MailerTemplate, data: Object, to: string, subject: string) {
    const tempPath = path.join(__dirname, `views/${type}.html`);
    const source = fs.readFileSync(tempPath, "utf-8").toString();
    const template = handlebar.compile(source);
    const htmlTemplate = template(data);

    return new Promise((resolve) => {
      return this.transporter.sendMail(
        {
          from: this.transporter.options.from,
          to,
          subject: subject || "Ultimate Gamers Hub Notification",
          html: htmlTemplate,
        },
        (err, info) => {
          if (err) console.table({ type, to, err: err.message });
          resolve();
        }
      );
    });
  }
}

export const mailer = new Mailer();
