/** External */
import TelegramBot from 'node-telegram-bot-api'

/** Internal */
import { getNewUser, getBotDescription } from './botUtils.js'
import { User } from './botTypes.js'

const startBotServer = () => {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string, { polling: true })

  const users: { [key: number]: User } = {}

  bot.on('message', msg => {
    const chatId = msg.chat.id
    const user = users[chatId]

    if (!user) users[chatId] = getNewUser()

    const activeCommand = user.activeCommand
    if (!activeCommand) {
      bot.sendMessage(chatId, getBotDescription(), { parse_mode: 'HTML' })
    }
  })
}

export { startBotServer }
