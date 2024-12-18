"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldSelectChannel } from "~/components/form/field/select-channel"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = `${ModuleId.AuditLogs}.channels`

export function AuditLogs() {
  const { control } = useFormContext<ModulesFormValuesInput>()

  return (
    <FormFieldWrapper>
      <FormFieldSelectChannel
        label="Server Logs"
        description="Logs for server events (channels, roles, boosts, etc)"
        control={control}
        name={`${baseName}.server`}
      />
      <FormFieldSelectChannel
        label="Punishment Logs"
        description="Logs for punishment events (mutes, kicks, bans, etc)"
        control={control}
        name={`${baseName}.punishments`}
      />
      <FormFieldSelectChannel
        label="Message Logs"
        description="Logs for message events (deletes, pins, reactions, etc)"
        control={control}
        name={`${baseName}.messages`}
      />
      <FormFieldSelectChannel
        label="Member Logs"
        description="Logs for member join and leave events"
        control={control}
        name={`${baseName}.members`}
      />
      <FormFieldSelectChannel
        label="Invite Logs"
        description="Logs for invite creates, deletes, and usage events"
        control={control}
        name={`${baseName}.invites`}
      />
      <FormFieldSelectChannel
        label="Voice Logs"
        description="Logs for voice channel join and leave events"
        control={control}
        name={`${baseName}.voice`}
      />
    </FormFieldWrapper>
  )
}
