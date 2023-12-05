/** External */
import mongoose from 'mongoose'
import { Bot, Context, session, SessionFlavor } from 'grammy'
import { type Conversation, type ConversationFlavor, conversations, createConversation } from '@grammyjs/conversations'
import { MongoDBAdapter, ISession } from '@grammyjs/storage-mongodb'

/** Internal */
import { getBotDescription } from './botUtils.js'

const startBotServer = async () => {
  try {
    // connect to db
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING as string)
    const collection = mongoose.connection.db.collection<ISession>('sessions')

    // types for the session
    interface InstagramAccount {
      name: string
      token: string
      bio?: string
    }
    interface SessionData {
      accounts: InstagramAccount[]
    }

    type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor
    type MyConversation = Conversation<MyContext>

    // upload conversation handler
    async function upload(conversation: MyConversation, ctx: MyContext) {
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

    // create bot
    const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_TOKEN as string)

    // middlewares
    bot.use(session({ initial: () => ({ accounts: [] }), storage: new MongoDBAdapter<SessionData>({ collection }) }))
    bot.use(conversations())
    bot.use(createConversation(upload))

    // input handlers
    bot.command('upload', ctx => ctx.conversation.enter('upload'))
    bot.on('message:text', ctx => ctx.reply(getBotDescription(), { parse_mode: 'HTML' }))

    // start bot
    bot.start()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('something went wrong')
  }
}

export { startBotServer }
