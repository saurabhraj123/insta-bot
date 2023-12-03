export const getNewUser = () => {
  return {
    activeCommand: null,
    instagram: {
      hasAccess: false,
      token: null,
    },
    media: null,
  }
}

export const getBotDescription = () => {
  return `<b>Instabot - An Instagram automation tool</b>
Let's you re-upload a media on instagram to your account.

<b>Commands:</b>
<b>1. /start</b> - Start the bot
<b>2. /remove</b> - Remove your account from the bot
<b>3. /update</b> - Update your account
<b>4. /upload</b> - Upload a media from instagram to your accountDeveloped by`
}
