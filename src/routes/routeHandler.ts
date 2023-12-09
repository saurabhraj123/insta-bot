/** External */
import express from 'express'
import passport from 'passport'
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Your account is now connected. Go to telegram to use it...')
})

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['instagram_basic', 'pages_show_list'] }))

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
