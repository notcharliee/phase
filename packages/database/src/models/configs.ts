import { ModuleId } from "@repo/utils/modules"
import mongoose from "mongoose"

import { defineModel } from "~/utils"

// status (subdocument) //

interface Status {
  type: StatusType
  text: string
  reason?: string
}

enum StatusType {
  Operational = "online",
  MinorIssues = "idle",
  MajorIssues = "dnd",
}

const statusSchema = new mongoose.Schema<Status>(
  {
    type: {
      type: mongoose.SchemaTypes.String,
      enum: Object.values(StatusType),
      required: true,
    },
    text: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    reason: {
      type: mongoose.SchemaTypes.String,
      required: false,
    },
  },
  { _id: false },
)

// blacklist (subdocument) //

interface Blacklist {
  users: {
    id: string
    reason?: string
  }[]
  guilds: {
    id: string
    reason?: string
  }[]
}

const blacklistSchema = new mongoose.Schema<Blacklist>(
  {
    users: [
      {
        id: {
          type: mongoose.SchemaTypes.String,
          required: true,
        },
        reason: {
          type: mongoose.SchemaTypes.String,
          required: false,
        },
      },
    ],
    guilds: [
      {
        id: {
          type: mongoose.SchemaTypes.String,
          required: true,
        },
        reason: {
          type: mongoose.SchemaTypes.String,
          required: false,
        },
      },
    ],
  },
  { _id: false },
)

// killswitch (subdocument) //

interface Killswitch {
  modules: ModuleId[]
}

const killswitchSchema = new mongoose.Schema<Killswitch>(
  {
    modules: {
      type: [
        {
          type: mongoose.SchemaTypes.String,
          enum: Object.values(ModuleId),
          required: true,
        },
      ],
      required: true,
    },
  },
  { _id: false },
)

// config (document) //

export interface Config {
  status: Status
  blacklist: Blacklist
  killswitch: Killswitch
}

export const configs = defineModel(
  "Configs",
  new mongoose.Schema<Config>({
    status: statusSchema,
    blacklist: blacklistSchema,
    killswitch: killswitchSchema,
  }),
)
