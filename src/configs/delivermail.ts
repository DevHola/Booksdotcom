import nodemailer from 'nodemailer'
const host = process.env.MAIL_HOST
const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASS
export interface mail{
  from: string
  to: string
  subject: string
  content: string
}
export const reusableMail = async (data: mail) => {
  try {
    const transporter = nodemailer.createTransport({
      host,
      port: 2525,
      auth: {
        user,
        pass
      }
    })
    await transporter.sendMail({
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.content
    })
  } catch (error) {
      throw new Error(`mailing failed`)
  }
}
