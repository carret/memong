/**
 * Created by Jaewook on 2015-08-01.
 */
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var pkginfo = require('./package');

//Serialize
//인증후 사용자 정보를 세션에 저장
passport.serializeUser(function (user, done) {
    done(null, user);
});

//deserialize
//인증후, 사용자 정보를 세션에서 읽어서 reqeust.user에 저장
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
        clientID: pkginfo.oauth.facebook.FACEBOOK_APP_ID,
        clientSecret: pkginfo.oauth.facebook.FACEBOOK_APP_SECRET,
        callbackURL: pkginfo.oauth.facebook.callbackURL,
        profileFields: ['email']
    },
    function (accessToken, refreshToken, profile, done) {
        var user = {
            email : profile._json.email
        };
        return done(null, user);
    }
));

passport.use(new GoogleStrategy({
        clientID: pkginfo.oauth.google.GOOGLE_APP_ID,
        clientSecret: pkginfo.oauth.google.GOOGLE_APP_SECRET,
        callbackURL: pkginfo.oauth.google.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
        var user = {
            email : profile._json.emails[0].value
        };
        return done(null, user);
    }
));

module.exports = passport;