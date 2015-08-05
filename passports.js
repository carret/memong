/**
 * Created by Jaewook on 2015-08-01.
 */
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

//Serialize
//������ ����� ������ ���ǿ� ����
passport.serializeUser(function (user, done) {
    console.log('serialize');
    done(null, user);
})

//deserialize
//������, ����� ������ ���ǿ��� �о reqeust.user�� ����
passport.deserializeUser(function (user, done) {
    console.log('deserialize');
    done(null, user);
})

passport.use(new FacebookStrategy({
        clientID: '906973419373720',
        clientSecret: '7e12213660608afcdaddc280438bb4c2',
        callbackURL: "http://localhost:8888/login/facebook/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        done(null, profile);
    }
));

module.exports = passport;