import express from 'express';
import passport from 'passport';
import SteamStrategy from 'passport-steam';

export const auth = express.Router();
export const checkAuth = passport.authenticate('steam');

auth.use(passport.initialize());
auth.use(passport.session());

passport.use(new SteamStrategy({
        returnURL: process.env.BACKENDURL + 'auth/login/return',
        realm: process.env.BACKENDURL,
        apiKey: process.env.STEAMAPIKEY 
    },
    function(identifier, profile, done) {
        let user = {
            id: identifier,
            steamId: profile.id,
            username: profile.displayName,
            profileUrl: profile._json.profileurl,
            avatar: profile._json.avatarfull,
        };
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

auth.get('/login', checkAuth);

auth.get('/login/return', 
    checkAuth, 
    (req, res) => {
        res.redirect(process.env.FRONTENDURL);
    });

auth.delete('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.send();
    })
});

auth.get('/user', (req, res) => {
    if (req.user) {
        res.send(req.user);
        return;
    }
    res.status(404).send('No user found.');
});
