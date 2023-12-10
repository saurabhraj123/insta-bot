/** Internal */
import User from '../db/schema/UserSchema.js'

export const getUserPayload = (
  facebookAccessToken: string,
  userDetails: { telegramUserId: string; first_name: string; last_name: string; username: string },
  instagramBusinessAccounts: { id: string; name: string; username: string }[],
) => {
  return {
    telegramUserId: userDetails.telegramUserId,
    username: userDetails.username,
    first_name: userDetails.first_name,
    last_name: userDetails.last_name,
    facebookAccessToken,
    instagramBusinessAccounts,
  }
}

export const getUser = async (telegramUserId: string) => {
  try {
    return await User.findOne({ telegramUserId })
  } catch (err) {
    throw err
  }
}
