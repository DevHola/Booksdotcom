"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reusableMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const user = process.env.GMAILUSER;
const pass = process.env.GMAILPASSWORD;
const reusableMail = async (data) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user,
                pass
            }
        });
        return await transporter.sendMail({
            from: user,
            to: data.to,
            subject: data.subject,
            html: data.content
        });
    }
    catch (error) {
        console.log(error);
        throw new Error(`mailing failed`);
    }
};
exports.reusableMail = reusableMail;
