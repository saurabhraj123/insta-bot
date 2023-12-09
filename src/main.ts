/** External */
import 'dotenv/config'
import express from 'express'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import connectToDatabase from './db/connection.js'
import { getExpressSession, getFacebookStrategy } from './auth/facebookStrategy.js'

/** Internal */
import { startBotServer } from './bot/botServer.js'
import { serializeUser, deserializeUser } from './utils/passport.js'
import routeHandler from './routes/routeHandler.js'

const startServer = async () => {
  try {
    const app = express()

    // db connection
    await connectToDatabase()

    // middlewares
    app.use(cookieParser())
    app.use(getExpressSession())
    app.use(passport.initialize())
    app.use(passport.session())
    passport.use(getFacebookStrategy())
    app.use('/', routeHandler)

    /** Start server */
    const PORT = process.env.PORT || 8080
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${PORT}`)

      startBotServer()
    })

    /** passport user serialization, deserialization */
    serializeUser()
    deserializeUser()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('something went wrong in starting the server', err)
  }
}

startServer()
