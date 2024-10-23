import { PermissionFlagsBits } from "discord.js"

import type {
  TrackedInvite,
  TrackedInviteCollection,
} from "~/structures/stores/InviteStore"
import type { Guild, Invite } from "discord.js"

export function hasRequiredGuildPermissions(guild: Guild) {
  const requiredPermissions = [PermissionFlagsBits.ManageGuild]

  return guild.members.me?.permissions.has(requiredPermissions)
}

export function mapInvite(invite: Invite): TrackedInvite {
  return {
    guildId: invite.guild!.id,
    inviterId: invite.inviter?.id ?? null,
    code: invite.code,
    uses: invite.uses ?? 0,
    maxUses: invite.maxUses ?? 0,
    maxAge: invite.maxAge ?? 0,
    deleted: false,
    createdTimestamp: invite.createdTimestamp ?? Date.now(),
    deletedTimestamp: null,
  }
}

export function getUsedInvite(
  collection_1: TrackedInviteCollection,
  collection_2: TrackedInviteCollection,
) {
  const invitesUsed: TrackedInvite[] = []

  // check for invites that were used and present in both cache and current data
  collection_2.forEach((invite_2) => {
    const invite_1 = collection_1.get(invite_2.code)
    if (invite_2.uses > 0 && invite_1 && invite_1.uses < invite_2.uses) {
      invitesUsed.push(invite_2)
    }
  })

  // if no invites found, check for recently deleted invites that were nearly maxed out
  if (invitesUsed.length === 0) {
    collection_1
      .sort((a, b) => (b.deletedTimestamp ?? 0) - (a.deletedTimestamp ?? 0))
      .forEach((invite) => {
        if (
          !collection_2.has(invite.code) &&
          invite.maxUses > 0 &&
          invite.uses === invite.maxUses - 1
        ) {
          invitesUsed.push(invite)
        }
      })
  }

  return invitesUsed[0]
}
