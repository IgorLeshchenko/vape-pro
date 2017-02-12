'use strict';

// Node imports:
import LocalStrategy from 'passport-local';

// App imports:
import UserModel from '../models/user.model';

const strategySetup = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

const serializeUser = (user, done) => {
    done(null, user.id);
};

const deSerializeUser = (id, done) => {
    UserModel.findById(id).exec()
        .then(user => done(null, user))
        .catch(error => done(error));
};

export default passport => {
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deSerializeUser);

    passport.use('local-login', new LocalStrategy(strategySetup, (req, email, password, done) => {
        const { role } = req.body;

        UserModel.findOne({ 'email': email, role }).exec()
            .then(user => {
                if (!user || !user.validPassword(password)) {
                    return done(null, false);
                }

                return done(null, user);
            })
            .catch(error => done(error, {}));
    }));

    passport.use('local-signup', new LocalStrategy(strategySetup, () => {
        // TODO :: Implement user sign up
    }));
};



