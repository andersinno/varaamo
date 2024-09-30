import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import nocache from 'nocache';

import configurePassport from './configurePassport';
import getAuthState from './getAuthState';

const router = express.Router(); // eslint-disable-line new-cap
const passport = configurePassport();
const maxSessionAge = 9 * 60 * 60 * 1000; // 9 hours

// Session handling
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieSession({
  secret: process.env.SESSION_SECRET,
  maxAge: maxSessionAge,
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());

router.get('/auth', nocache(), (req, res) => {
  res.json(getAuthState(req));
});

router.get('/login',
  (req, res, next) => {
    req.session.next = req.query.next; // eslint-disable-line no-param-reassign
    next();
  },
  (req, res, next) => {
    passport.authenticate('tampere', { ui_locales: req.query.ui_locales })(req, res, next);
  });

router.get('/login/tampere/return',
  passport.authenticate('tampere', { failureRedirect: '/login' }),
  (req, res) => {
    if (req.session.next) {
      const redirectUrl = req.session.next;
      req.session.next = null; // eslint-disable-line no-param-reassign
      res.redirect(redirectUrl);
    } else {
      res.redirect('/');
    }
  });

router.get('/logout', (req, res) => {
  req.logOut();
  const logoutUrl = process.env.AUTH_LOGOUT_URL || 'https://auth.tampere.fi/logout/';
  const redirectUrl = req.query.next || 'https://varaamo.tampere.fi';
  const uiLocales = req.query.ui_locales || 'fi';
  res.redirect(`${logoutUrl}?next=${redirectUrl}&ui_locales=${uiLocales}`);
});

export default router;
