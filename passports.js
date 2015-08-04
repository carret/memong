/**
 * Created by Jaewook on 2015-08-01.
 */
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

//Serialize
//인증후 사용자 정보를 세션에 저장
passport.serializeUser(function (user, done) {
    console.log('serialize');
    done(null, user);
})

//deserialize
//인증후, 사용자 정보를 세션에서 읽어서 reqeust.user에 저장
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