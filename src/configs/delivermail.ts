import nodemailer from 'nodemailer'
const user = process.env.GMAILUSER
const pass = process.env.GMAILPASSWORD
export interface mail{
  from: string
  to: string
  subject: string
  content: string
}
export const reusableMail = async (data: mail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    })
    return await transporter.sendMail({
      from: user,
      to: data.to,
      subject: data.subject,
      html: data.content
    })
  } catch (error) {
      console.log(error)
      throw new Error(`mailing failed`)
  }
}
