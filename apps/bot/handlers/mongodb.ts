import * as Discord from 'discord.js'
import * as Utils from 'utils/.build/bot'
import * as Schemas from 'utils/.build/schemas'
import mongoose from 'mongoose'


export default async (uri?: string) => {

  try {

    await mongoose.connect(uri!)
      
  } catch (error) {
    throw error
  }

  ['SIGINT', 'SIGTERM', 'SIGQUIT']
  .forEach(signal => process.on(signal, () => {
    mongoose.connection.close()
    process.exit()
  }))

}