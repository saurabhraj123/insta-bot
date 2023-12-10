/** External */
import _ from 'lodash'
import express from 'express'
import passport from 'passport'
const router = express.Router()

/** Internal */
import { handleAuthenticatedUser } from '../utils/auth.js'

router.get('/', async (req, res) => {
  try {
    if (req.user) return await handleAuthenticatedUser(req, res)
    return res.send('You are not authenticated')
  } catch (err) {
    return res.status(500).send('Internal server errror')
  }
})

router.get(
  '/auth/facebook',
  (req, res, next) => {
    _.forEach(req.query, (value, key) => {
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
    res.redirect('/')
  },
)

router.get('/error', (req, res) => {
  res.send('Something went wrong.. Please try again..')
})

export default router
