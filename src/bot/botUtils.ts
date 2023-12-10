/** Internal */
import { getAccessToken } from '../utils/auth.js'
import { MyConversation, MyContext } from '../types/botTypes.js'

export const isInstagramPostUrl = (url: string) => {
  const regex = /https:\/\/www.instagram.com\/(?:p|reel)\/[a-zA-Z0-9]+\/?/g

  return regex.test(url)
}

export const getBotDescription = () => {
  return `<b>Instabot - An Instagram automation tool</b>
Lets you re-upload a media on instagram to your account.

<b>Commands:</b>
<b>1. /start</b> - Start the bot
<b>2. /manage_accounts</b> - Manage your linked insta accounts
<b>3. /upload</b> - Upload a media from instagram to your accountDeveloped by
<b>4. /cancel</b> - Cancel the current operation`
}

export const uploadConversationHandler = async (conversation: MyConversation, ctx: MyContext) => {
  const id = ctx.from?.id
  if (id) {
    const facebookAccessToken = await getAccessToken(id.toString())
    if (facebookAccessToken) {
      while (true) {
        ctx.reply('Please enter the instagram post link to re-upload')
        const postUrlCtx = await conversation.waitFor(':text')
        const postUrl = postUrlCtx.msg.text

        if (postUrl === '/cancel') return ctx.reply(`Cancelled operation.\n${getBotDescription()}`)

        if (!isInstagramPostUrl(postUrlCtx.msg.text))
          ctx.reply('Please enter a valid instagram post url. Enter /cancel to go to main menu.')

        break
      }

      // while (true) {
      //   ctx.reply('Please enter the caption:')
      //   const captionCtx = await conversation.waitFor(':text')
      //   const caption = captionCtx.msg.text

      //   if (caption === '/cancel') return ctx.reply(`Cancelled operation.\n${getBotDescription()}`)

      //   if (!captionCtx.msg.text) ctx.reply('Please enter a valid caption. Enter /cancel to go to main menu.')

      //   break
      // }
    }
  } else {
    return ctx.reply('You have no accounts linked! Use /add_account to link your account.')
  }

  return
  // await ctx.reply('How many favorite movies do you have?')
  // const count = await conversation.form.number()
  // const movies: string[] = []
  // for (let i = 0; i < count; i++) {
  //   await ctx.reply(`Tell me number ${i + 1}!`)
  //   const titleCtx = await conversation.waitFor(':text')
  //   movies.push(titleCtx.msg.text)
  // }
  // await ctx.reply('Here is a better ranking!')
  // movies.sort()
  // await ctx.reply(movies.map((m, i) => `${i + 1}. ${m}`).join('\n'))
}
