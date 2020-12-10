import handlebar from "handlebars";
import fs from "fs";
import path from "path";
import { createTransport } from "nodemailer";
import { MailerTemplate } from "./enum/mailer-template";
import Mail from "nodemailer/lib/mailer";
import { format } from "date-fns";

class Mailer {
  private transporter?: Mail;
  init(password: string, email: string) {
    this.transporter = createTransport({
      host: "smtp.zoho.in",
      secure: true,
      port: 465,
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
          from: process.env.EMAIL,
          to,
          subject: subject || "Ultimate Gamers Hub Notification",
          html: htmlTemplate,
        },
        (err, info) => {

          if (err) {
            console.log({
              type,
              to,
              err: err.message,
              info,
              on: format(Date.now(), "dd/MM/yyyy hh:mm a"),
            });
            this.transporter.close()
          }
          resolve();
        }
      );
    });
  }
}

export const mailer = new Mailer();
