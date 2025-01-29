"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regverificationmail = exports.verificationmail = exports.Resetpasswordmail = exports.otpgen = exports.extractor = exports.creditAuthorAccount = exports.getFeaturedAuthors = exports.getUserPreference = exports.removeFromPreference = exports.addToPreference = exports.getUserWishlist = exports.removeFromWishlist = exports.addToWishlist = exports.assignUserRole = exports.activate = exports.checkOTP = exports.verifyVerificationToken = exports.verifyResetToken = exports.changePassword = exports.generateToken = exports.getUserById = exports.ValidateUserPassword = exports.CheckUserExist = exports.nameExist = exports.UserExist = exports.UserByEmail = exports.limitUser = exports.registerUser = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const profile_model_1 = __importDefault(require("../models/profile.model"));
const registerUser = async (data, type) => {
    if (type === 'local') {
        const user = await User_model_1.default.create({
            name: data.name,
            email: data.email,
            password: data.password
        });
        await user.save();
    }
    else {
        const user = await User_model_1.default.create({
            name: data.name,
            email: data.email,
            provider: data.provider,
            provider_id: data.provider_id,
            isverified: true
        });
        await user.save();
    }
    const authtoken = await (0, exports.generateToken)(data, 'verification');
    if (authtoken) {
        return authtoken;
    }
    else {
        throw new Error('Token generation failed');
    }
};
exports.registerUser = registerUser;
const limitUser = async (email) => {
    return await User_model_1.default.findOne({ email: email }, { email: 1, _id: 1, role: 1, name: 1, isverified: 1 });
};
exports.limitUser = limitUser;
const UserByEmail = async (email) => {
    const user = await User_model_1.default.findOne({ email: email });
    if (!user) {
        throw new Error('Account not found');
    }
    return user;
};
exports.UserByEmail = UserByEmail;
const UserExist = async (email) => {
    const user = await User_model_1.default.findOne({ email: email });
    return user;
};
exports.UserExist = UserExist;
const nameExist = async (name) => {
    const user = await User_model_1.default.findOne({ name: name });
    return user;
};
exports.nameExist = nameExist;
const CheckUserExist = async (id) => {
    const user = await User_model_1.default.findOne({ provider_id: id });
    return user;
};
exports.CheckUserExist = CheckUserExist;
const ValidateUserPassword = async (email, password) => {
    const result = await User_model_1.default.findOne({ email });
    if (!result) {
        throw new Error('authentication failed');
    }
    if (result.isverified === false) {
        throw new Error('Account not verified');
    }
    const user = result;
    const hash = user.password;
    const verify = await bcrypt_1.default.compare(password, hash);
    if (!verify) {
        throw new Error('authentication failed');
    }
    const data = { _id: user._id, email, role: user.role };
    const token = await (0, exports.generateToken)(data, 'login');
    await User_model_1.default.findByIdAndUpdate(user._id, { $set: { lastLogin: Date.now() } });
    if (token) {
        return token;
    }
    else {
        throw new Error('Token generation failed');
    }
};
exports.ValidateUserPassword = ValidateUserPassword;
const getUserById = async (id) => {
    const user = await User_model_1.default.findOne({ _id: id }, { _id: 1, name: 1, email: 1, role: 1, isverified: 1 });
    return user;
};
exports.getUserById = getUserById;
const generateToken = async (data, type) => {
    const userdata = { id: data._id, email: data.email, role: data.role };
    const verifydata = { id: data._id, email: data.email };
    switch (type) {
        case 'verification':
            return await jsonwebtoken_1.default.sign(verifydata, process.env.VERIFY_PRIVATE_SECRET, { algorithm: 'RS256', expiresIn: process.env.AUTH_TOKEN_EXPIRY });
            break;
        case 'login':
            return await jsonwebtoken_1.default.sign(userdata, process.env.AUTH_ACCESS_PRIVATE_SECRET, { algorithm: 'RS256', expiresIn: process.env.AUTH_TOKEN_EXPIRY });
            break;
        case 'reset':
            return await jsonwebtoken_1.default.sign(userdata, process.env.RESET_PRIVATE_SECRET, { algorithm: 'RS256', expiresIn: process.env.AUTH_TOKEN_EXPIRY });
            break;
        default:
            return null;
            break;
    }
};
exports.generateToken = generateToken;
const changePassword = async (id, password) => {
    const hash = await bcrypt_1.default.hash(password, 10);
    await User_model_1.default.findOneAndUpdate({ _id: id }, { $set: { password: hash } }, { upsert: true });
};
exports.changePassword = changePassword;
const verifyResetToken = async (token) => {
    const decoded = await jsonwebtoken_1.default.verify(token, process.env.RESET_PUBLIC_SECRET, { algorithms: ['RS256'] });
    const user = await (0, exports.UserByEmail)(decoded.email);
    if (!user) {
        throw new Error('authentication failed');
    }
    const id = user._id;
    return id;
};
exports.verifyResetToken = verifyResetToken;
const verifyVerificationToken = async (token) => {
    const decoded = await jsonwebtoken_1.default.verify(token, process.env.VERIFY_PUBLIC_SECRET, { algorithms: ['RS256'] });
    const user = await (0, exports.UserByEmail)(decoded.email);
    if (!user) {
        throw new Error('authentication failed');
    }
    const id = user._id;
    return id;
};
exports.verifyVerificationToken = verifyVerificationToken;
const checkOTP = async (otpdata, id) => {
    const user = await User_model_1.default.findOne({ _id: id });
    const verify = user.otp === otpdata;
    return verify;
};
exports.checkOTP = checkOTP;
const activate = async (id) => {
    const user = await User_model_1.default.findByIdAndUpdate(id, { isverified: true, otp: null });
    return user;
};
exports.activate = activate;
const assignUserRole = async (id, role) => {
    const user = await User_model_1.default.findByIdAndUpdate(id, { role: role });
    return user;
    // add if user role is creator create a profile for the user which they would need to update to be able to use the platform
};
exports.assignUserRole = assignUserRole;
const addToWishlist = async (userid, productid) => {
    const user = await User_model_1.default.findById(userid);
    if (!user) {
        throw new Error('user not found');
    }
    if (user.wishlist.includes(productid)) {
        throw new Error('Product already in wishlist');
    }
    user.wishlist.push(productid);
    return await user.save();
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (userid, productid) => {
    return await User_model_1.default.findByIdAndUpdate(userid, {
        $pull: {
            wishlist: productid
        }
    }, { new: true });
};
exports.removeFromWishlist = removeFromWishlist;
const getUserWishlist = async (userid) => {
    return await User_model_1.default.findOne({ _id: userid }, {
        wishlist: 1
    }).populate("wishlist").exec();
};
exports.getUserWishlist = getUserWishlist;
const addToPreference = async (userid, categoryid) => {
    const user = await User_model_1.default.findById(userid);
    if (!user) {
        throw new Error('user not found');
    }
    const updated = await User_model_1.default.findByIdAndUpdate(user._id, {
        $addToSet: {
            preferences: {
                $each: categoryid
            }
        }
    }, { new: true });
    if (!updated) {
        throw new Error('Error updating user preferences');
    }
    return updated;
};
exports.addToPreference = addToPreference;
const removeFromPreference = async (userid, category) => {
    console.log(category);
    return await User_model_1.default.findByIdAndUpdate(userid, {
        $pull: {
            preferences: {
                $in: category
            }
        }
    }, { new: true });
};
exports.removeFromPreference = removeFromPreference;
const getUserPreference = async (userid) => {
    return await User_model_1.default.findOne({ _id: userid }, {
        preferences: 1
    }).populate({
        path: 'preferences',
        select: ['_id', 'name']
    }).exec();
};
exports.getUserPreference = getUserPreference;
const getFeaturedAuthors = async (page, limit) => {
    const [authors, totalauthors] = await Promise.all([
        await User_model_1.default.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'profile',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $unwind: '$profile'
            },
            {
                $match: {
                    'type': 'creator',
                    'profile.isFeatured': true
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    img: '$profile.imgsrc',
                }
            }
        ]).skip((page - 1) * limit).limit(limit).exec(),
        await profile_model_1.default.find({ isFeatured: true }).countDocuments()
    ]);
    return { authors, currentPage: page, totalPage: Math.ceil(totalauthors / limit), totalauthors };
};
exports.getFeaturedAuthors = getFeaturedAuthors;
const creditAuthorAccount = async (author, total, session) => {
    const user = await User_model_1.default.findById(author);
    await profile_model_1.default.findByIdAndUpdate(user?.profile, {
        $inc: {
            balance: total
        }
    }, { new: true }).session(session);
};
exports.creditAuthorAccount = creditAuthorAccount;
const extractor = async (req) => {
    const headers = req.headers['authorization'];
    if (headers) {
        const [header, token] = headers.split(' ');
        if (header !== 'Bearer' || (token.length === 0)) {
            throw new Error('Invalid Access Token');
        }
        return token;
    }
    else {
        throw new Error('Missing Access Credentials');
    }
};
exports.extractor = extractor;
const otpgen = async (id) => {
    const code = Math.floor(Math.random() * 600000) + 100000;
    await storeOTP(code.toString(), id);
    return code.toString();
};
exports.otpgen = otpgen;
const storeOTP = async (otpdata, id) => {
    await User_model_1.default.findByIdAndUpdate(id, { otp: otpdata });
};
const Resetpasswordmail = async (resettoken, email) => {
    const url = `${process.env.FRONTEND_URL}/newpassword/?token=${resettoken}`;
    const content = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #007bff;
                      color: #ffffff;
                  }
                  .content {
                      padding: 20px;
                  }
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      color: #ffffff;
                      background-color: #007bff;
                      text-decoration: none;
                      border-radius: 4px;
                      text-align: center;
                  }
                  .footer {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #f4f4f4;
                      color: #777777;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Password Reset Request</h1>
                  </div>
                  <div class="content">
                      <p>Hello,</p>
                      <p>We received a request to reset your password. Click the button below to reset your password:</p>
                      <p>
                          <a href="${url}" class="button">Reset Password</a>
                      </p>
                      <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                      <p>Thank you,<br>The Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2024 Booksdotcom. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`;
    const subject = 'ACCOUNT PASSWORD RESET';
    const from = process.env.FROM ?? 'no-reply@yourcompany.com';
    const data = {
        to: email,
        content,
        subject,
        from
    };
    return data;
};
exports.Resetpasswordmail = Resetpasswordmail;
const verificationmail = async (resettoken, email, otp) => {
    const url = `${process.env.FRONTEND_URL}/auth/verify/token=${resettoken}`;
    const content = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #007bff;
                      color: #ffffff;
                  }
                  .content {
                      padding: 20px;
                  }
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      color: #ffffff;
                      background-color: #007bff;
                      text-decoration: none;
                      border-radius: 4px;
                      text-align: center;
                  }
                  .footer {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #f4f4f4;
                      color: #777777;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Verification Request</h1>
                  </div>
                  <div class="content">
                      <p>Hello,</p>
                      <p>We received a request to verify your Account. Click the button below to reset your password:</p>
                      <p>
                          <a href="${url}" class="button">Verify</a>
                      </p>
                      <h1> Verification code </h1>
                      <p>${otp}</p>
                      <p>token: ${resettoken}</p>
                      <p>Thank you,<br>The Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2024 Booksdotcom. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`;
    const subject = 'ACCOUNT VERIFICATION';
    const from = process.env.FROM ?? 'no-reply@yourcompany.com';
    const data = {
        to: email,
        content,
        subject,
        from
    };
    return data;
};
exports.verificationmail = verificationmail;
const Regverificationmail = async (email, otp) => {
    const content = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #007bff;
                      color: #ffffff;
                  }
                  .content {
                      padding: 20px;
                  }
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      color: #ffffff;
                      background-color: #007bff;
                      text-decoration: none;
                      border-radius: 4px;
                      text-align: center;
                  }
                  .footer {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #f4f4f4;
                      color: #777777;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Verification</h1>
                  </div>
                  <div class="content">
                      <p>Hello,</p>
                      <p>We received a request to verify your Account. </p>
                      <h1> Verification code </h1>
                      <p>${otp}</p>
                      <p>Thank you,<br>The Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2024 Booksdotcom. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`;
    const subject = 'ACCOUNT VERIFICATION';
    const from = process.env.FROM ?? 'no-reply@yourcompany.com';
    const data = {
        to: email,
        content,
        subject,
        from
    };
    return data;
};
exports.Regverificationmail = Regverificationmail;
// LOGIN:
// REGISTER:
// FORGET:
// RESET:
// MAIL:
// REQUEST: VERIFICICATION
// VERIFICATION:-
// PROFILE:-
