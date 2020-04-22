import passport from 'passport';
import { Strategy } from 'passport-tampere';

import settings from '../../config/settings';


function configurePassport() {
  const tampereStrategy = new Strategy(
    {
      clientID: settings.CLIENT_ID,
      clientSecret: settings.CLIENT_SECRET,
      callbackURL: settings.LOGIN_CALLBACK_URL || '/login/tampere/return',
      proxy: Boolean(settings.PROXY),
    },
    (accessToken, refreshToken, profile, cb) => {
      tampereStrategy.getAPIToken(accessToken, settings.TARGET_APP, (token) => {
        const profileWithToken = Object.assign({}, profile, { token });
        return cb(null, profileWithToken);
      });
    },
  );

  passport.use(tampereStrategy);

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

  return passport;
}

export default configurePassport;
