/** External */
import mongoose from 'mongoose'

export interface UserType {
  telegramUserId: string
  first_name: string
  last_name: string
  username: string
  facebookAccessToken: string
  instagramBusinessAccounts: { id: string; username: string; name: string }[]
}

const UserSchema = new mongoose.Schema({
  telegramUserId: { type: String, unique: true, dropDups: true },
  first_name: String,
  last_name: String,
  username: String,
  facebookAccessToken: { type: String, unique: true, dropDups: true },
  instagramBusinessAccounts: [{ id: String, username: String, name: String }],
})

export default mongoose.model('User', UserSchema)
