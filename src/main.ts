/** External */
import 'dotenv/config'
import express from 'express'

/** Internal */
import { startBotServer } from './bot/botServer.js'

function startServer() {
  const app = express()

  const PORT = process.env.PORT || 8080
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`)

    // start bot server
    startBotServer()
  })
}

startServer()
