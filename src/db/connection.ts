/** External */
import { ISession } from '@grammyjs/storage-mongodb'
import mongoose from 'mongoose'

const connectToDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_CONNECTION_STRING as string)
    return connection
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MongoDB:', err)
    throw err
  }
}

export const getSessionCollection = () => {
  return mongoose.connection.db.collection<ISession>('sessions')
}

export default connectToDatabase
