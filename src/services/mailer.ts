import nodemailer from 'nodemailer';

const testAccount = {
    user: 'stevie11@ethereal.email',
    pass: 'emnefGkytzm2FBUQJk',
};

export class MailerService {
    static async sendEmail(to: string, html: string): Promise<void> {
        const transporter = await this.createTransporter();
        const info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to,
            subject: 'Change password',
            html,
        });

        console.log('Message sent: %s', info.messageId);
        console.log('URL', nodemailer.getTestMessageUrl(info));
    }

    private static async createTransporter(): Promise<nodemailer.Transporter> {
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
}
