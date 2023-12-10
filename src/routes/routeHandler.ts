/** External */
import _ from 'lodash'
import express from 'express'
import passport from 'passport'
const router = express.Router()

/** Internal */
import { getInstaPageDetails } from '../utils/facebookGraphAPI.js'

router.get('/', async (req, res) => {
  try {
    if (req.user) {
      const { token } = req.user as { token: string }
      const telegramUserId = req.cookies.telegramUserId

      if (token && telegramUserId) {
        const instaPageDetails = await getInstaPageDetails(token)
        console.log('instaPageDetails', instaPageDetails)
        // const user = combineUserDetails(telegramUserId, )
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
    // Loop through all query parameters using lodash forEach
    _.forEach(req.query, (value, key) => {
      // Set each query parameter as a cookie
      res.cookie(key, value, { maxAge: 900000, httpOnly: true })
    })

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
