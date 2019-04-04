import passport from 'passport';
import { Strategy } from 'passport-tampere';

function configurePassport() {
  const tampereStrategy = new Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.LOGIN_CALLBACK_URL || '/login/tampere/return',
      proxy: Boolean(process.env.PROXY),
    },
    (accessToken, refreshToken, profile, cb) => {
      tampereStrategy.getAPIToken(accessToken, process.env.TARGET_APP, (token) => {
        const profileWithToken = Object.assign({}, profile, { token });
        return cb(null, profileWithToken);
      });
    }
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
