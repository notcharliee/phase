import mongoose from 'mongoose'

try {
    await mongoose.connect(process.env.mongodb || '')
} catch(error) {
    throw new Error(`⛔ Mongoose Connection Error | ${error}`)
}


import autoroles from './models/autoroles'
import jointocreate from './models/jointocreate'
import levels from './models/levels'
import logins from './models/logins'
import logs from './models/logs'
import reactionroles from './models/reactionroles'

export { autoroles, jointocreate, levels, logins, logs, reactionroles }