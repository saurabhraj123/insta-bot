/** External */
import express from 'express'
import passport from 'passport'
const router = express.Router()

/** Internal */
import { getInstaPageDetailsAndAddToDb } from '../utils/facebookGraphAPI.js'

router.get('/', async (req, res) => {
  try {
    if (req.user) {
      const { token } = req.user as { token: string }
      const telegramUserId = req.cookies.telegramUserId

      if (token && telegramUserId) {
        await getInstaPageDetailsAndAddToDb(token)
        return res.send('Your account is now connected. Go to telegram to use it...')
      }

      return res.send('You are not authenticated')
    }

    return res.send('You are not authenticated')
  } catch (err) {
    return res.status(500).send('Internal server errror')
  }
})

router.get(
  '/auth/facebook',
  (req, res, next) => {
    const { telegramUserId } = req.query as { telegramUserId: string }
    res.cookie('telegramUserId', telegramUserId, { maxAge: 900000, httpOnly: true })

    next()
  },
  passport.authenticate('facebook', { scope: ['instagram_basic', 'pages_show_list', 'instagram_content_publish'] }),
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
