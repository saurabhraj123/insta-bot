/** External */
import { Bot, session } from 'grammy'
import { conversations, createConversation } from '@grammyjs/conversations'

/** Internal */
import { getBotDescription, uploadConversationHandler } from './botUtils.js'
import { MyContext, MyConversation } from 'src/types/botTypes.js'

const startBotServer = async () => {
  try {
    // manage accounts
    async function manageAccounts(conversation: MyConversation, ctx: MyContext) {
      ctx.reply('Manage accounts')
      return
    }

    // add account
    async function addAccount(conversation: MyConversation, ctx: MyContext) {
      const user = ctx.from
      if (user) {
        const { id, first_name, last_name, username } = user

        const queryParams = [
          `telegramUserId=${id}`,
          first_name && `first_name=${first_name}`,
          last_name && `last_name=${last_name}`,
          username && `username=${username}`,
        ].filter(Boolean)

        const link = `http://www.localhost:3000/auth/facebook?${queryParams.join('&')}`

        ctx.reply(`<b>Click on the given link to add an account:</b> <a href="${link}">here</a>`, {
          parse_mode: 'HTML',
        })
      }
      return
    }

    // create bot
    const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_TOKEN as string)

    // middlewares
    bot.use(session({ initial: () => ({}) }))
    bot.use(conversations())
    bot.use(createConversation(uploadConversationHandler, 'upload'))
    bot.use(createConversation(addAccount))
    bot.use(createConversation(manageAccounts))

    // input handlers
    bot.command('upload', ctx => ctx.conversation.enter('upload'))
    bot.command('manage_accounts', ctx => ctx.conversation.enter('manageAccounts'))
    bot.command('add_account', ctx => ctx.conversation.enter('addAccount'))
    bot.on('message:text', ctx => ctx.reply(getBotDescription(), { parse_mode: 'HTML' }))

    // start bot
    bot.start()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('something went wrong in bot server', err)
  }
}

export { startBotServer }
