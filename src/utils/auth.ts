/** External */
import express from 'express'

/** Internal */
import { getInstaPageDetails } from '../utils/facebookGraphAPI.js'
import { getUser, getUserPayload } from './user.js'
import { addNewUser } from '../db/utils/mutations.js'

export const handleAuthenticatedUser = async (req: express.Request, res: express.Response) => {
  const { token } = req.user as { token: string }
  const { telegramUserId, username, first_name, last_name } = req.cookies

  if (telegramUserId && username) {
    const instaPageDetails = await getInstaPageDetails(token)
    const user = getUserPayload(token, { telegramUserId, username, first_name, last_name }, instaPageDetails)
    await addNewUser(user)
    return res.send('Your account is now connected. Go to telegram to use it...')
  }

  return res.status(400).send('Error 400. Bad request.')
}

export const getAccessToken = async (userId: string) => {
  try {
    const user = await getUser(userId)
    return user?.facebookAccessToken
  } catch (err) {
    throw err
  }
}
