/** External */
import express from 'express'
import passport from 'passport'
const router = express.Router()

router.get('/', (req, res) => {
  if (req.user) {
    const { token } = req.user as { token: string }
    const telegramUserId = req.cookies.telegramUserId

    if (token && telegramUserId) {
      return res.send('Your account is now connected. Go to telegram to use it...')
    }

    return res.send('You are not authenticated')
  }

  return res.send('You are not authenticated')
})

router.get(
  '/auth/facebook',
  (req, res, next) => {
    const { telegramUserId } = req.query as { telegramUserId: string }
    res.cookie('telegramUserId', telegramUserId, { maxAge: 900000, httpOnly: true })

    next()
  },
  passport.authenticate('facebook', { scope: ['instagram_basic', 'pages_show_list'] }),
)

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/')
  },
)

router.get('/error', (req, res) => {
  res.send('Something went wrong.. Please try again..')
})

export default router
