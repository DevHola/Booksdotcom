"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = exports.GGstrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_services_1 = require("../services/auth.services");
const authorizationExtractor = function (req) {
    if ((req.headers.authorization != null) && req.headers.authorization.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];
        return token;
    }
    return null;
};
const secret = process.env.AUTH_ACCESS_TOKEN_PUBLIC_SECRET;
if (!secret) {
    throw new Error('AUTH_ACCESS_TOKEN_SECRET is not defined');
}
exports.default = new passport_jwt_1.Strategy({
    jwtFromRequest: authorizationExtractor,
    secretOrKey: secret,
    algorithms: ['RS256']
}, async (payload, done) => {
    try {
        const user = await (0, auth_services_1.limitUser)(payload.email);
        if (user !== null) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    }
    catch (error) {
        done(error, false);
    }
});
const clientID = process.env.GOOGLE_CLIENT_ID;
if (!clientID) {
    throw new Error('GOOGLE_CLIENT_ID is not defined');
}
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientSecret) {
    throw new Error('GOOGLE_CLIENT_SECRET is not defined');
}
exports.GGstrategy = new passport_google_oauth20_1.Strategy({
    clientID,
    clientSecret,
    callbackURL: process.env.CALLBACKURL,
    passReqToCallback: true
}, async function (request, accessToken, refreshToken, profile, done) {
    const data = {
        provider: profile.provider,
        provider_id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
    };
    const user = await (0, auth_services_1.CheckUserExist)(data.provider_id);
    if (user) {
        const token = await (0, auth_services_1.generateToken)(user, 'login');
        return done(null, { token: token, action: 'login', role: user.role });
    }
    else {
        const token = await (0, auth_services_1.registerUser)(data, 'verification');
        return done(null, { token: token, action: 'register', role: 'none' });
    }
});
const authorization = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        const userRole = user.role ? [user.role] : [];
        const hasPermission = userRole.some((role) => roles.role.includes(role));
        if (!hasPermission) {
            return res.status(403).json({ message: 'You do not have permission to access this resource' });
        }
        next();
    };
};
exports.authorization = authorization;
