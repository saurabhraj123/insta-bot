/** External */
import passport from 'passport'

export const serializeUser = () => {
  passport.serializeUser(function (user, done) {
    done(null, user)
  })
}

export const deserializeUser = () => {
  passport.deserializeUser(function (user, done) {
    done(null, user as any)
  })
}
