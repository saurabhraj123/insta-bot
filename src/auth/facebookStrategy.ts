/** External */
import { Strategy as FacebookStrategy } from 'passport-facebook'
import session from 'express-session'

export const getFacebookStrategy = () =>
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: '/auth/facebook/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      cb(null, { id: profile.id, token: accessToken })
    },
  )

export const getExpressSession = () =>
  session({
    secret: process.env.EXPRESS_SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
  })
