/** Internal */
import User, { UserType } from '../../db/schema/UserSchema.js'

export const addNewUser = async (user: UserType) => {
  try {
    const newUser = new User(user)
    await newUser.save()
  } catch (err) {
    throw err
  }
}
