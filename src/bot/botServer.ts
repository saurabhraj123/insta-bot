/** External */
import { Bot, Context, session } from 'grammy'
import { type Conversation, type ConversationFlavor, conversations, createConversation } from '@grammyjs/conversations'

/** Internal */
import { getBotDescription } from './botUtils.js'

const startBotServer = async () => {
  try {
    type MyContext = Context & ConversationFlavor
    type MyConversation = Conversation<MyContext>

    // upload conversation handler
    async function upload(conversation: MyConversation, ctx: MyContext) {
      if (3 > 2) {
        await ctx.reply('You have no accounts linked! Use /add_account to link your account.')
        return
      }

      await ctx.reply('How many favorite movies do you have?')
      const count = await conversation.form.number()
      const movies: string[] = []
      for (let i = 0; i < count; i++) {
        await ctx.reply(`Tell me number ${i + 1}!`)
        const titleCtx = await conversation.waitFor(':text')
        movies.push(titleCtx.msg.text)
      }
      await ctx.reply('Here is a better ranking!')
      movies.sort()
      await ctx.reply(movies.map((m, i) => `${i + 1}. ${m}`).join('\n'))
    }

    // manage accounts
    async function manageAccounts(conversation: MyConversation, ctx: MyContext) {
      ctx.reply('Manage accounts')
      return
    }

    // add account
    async function addAccount(conversation: MyConversation, ctx: MyContext) {
      const telegramUserId = ctx.from?.id
      ctx.reply(
        `<b>Click on the given link to add an account:</b> <a href="http://www.localhost:3000/auth/facebook?telegramUserId=${telegramUserId}">here</a>`,
        { parse_mode: 'HTML' },
      )
      return
    }

    // create bot
    const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_TOKEN as string)

    // middlewares
    bot.use(session({ initial: () => ({}) }))
    bot.use(conversations())
    bot.use(createConversation(upload))
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
