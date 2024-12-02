import { BotErrorMessage } from "~/structures/BotError"

export enum FormAction {
  CreateForm = "start", // TODO: rename to create
  DeleteForm = "delete",
  AcceptSubmission = "accept",
  AcceptSubmissionWithReasonModal = "accept_with_reason_modal",
  AcceptSubmissionWithReasonTrigger = "accept_with_reason_trigger",
  AcceptSubmissionWithReasonValue = "accept_with_reason_value",
  RejectSubmission = "reject",
  RejectSubmissionWithReasonModal = "reject_with_reason_modal",
  RejectSubmissionWithReasonTrigger = "reject_with_reason_trigger",
  RejectSubmissionWithReasonValue = "reject_with_reason_value",
}

export enum FormInput {
  ButtonYes = "input_button_yes",
  ButtonNo = "input_button_no",
  ButtonSkip = "input_button_skip",
  Modal = "input_modal",
  ModalTrigger = "input_modal_trigger",
  ModalValue = "input_modal_value",
  Select = "input_select",
}

export const formCustomIds = {
  create: (formId: string) => `form.${FormAction.CreateForm}.${formId}`,
  delete: (formId: string, formThreadId: string) =>
    `form.${FormAction.DeleteForm}.${formId}.${formThreadId}`,
  accept: (formId: string, formThreadId: string) =>
    `form.${FormAction.AcceptSubmission}.${formId}.${formThreadId}`,
  acceptWithReasonModal: (formId: string, formThreadId: string) =>
    `form.${FormAction.AcceptSubmissionWithReasonModal}.${formId}.${formThreadId}`,
  acceptWithReasonTrigger: (formId: string, formThreadId: string) =>
    `form.${FormAction.AcceptSubmissionWithReasonTrigger}.${formId}.${formThreadId}`,
  acceptWithReasonValue: (formId: string, formThreadId: string) =>
    `form.${FormAction.AcceptSubmissionWithReasonValue}.${formId}.${formThreadId}`,
  reject: (formId: string, formThreadId: string) =>
    `form.${FormAction.RejectSubmission}.${formId}.${formThreadId}`,
  rejectWithReasonModal: (formId: string, formThreadId: string) =>
    `form.${FormAction.RejectSubmissionWithReasonModal}.${formId}.${formThreadId}`,
  rejectWithReasonTrigger: (formId: string, formThreadId: string) =>
    `form.${FormAction.RejectSubmissionWithReasonTrigger}.${formId}.${formThreadId}`,
  rejectWithReasonValue: (formId: string, formThreadId: string) =>
    `form.${FormAction.RejectSubmissionWithReasonValue}.${formId}.${formThreadId}`,

  input_button_yes: `form.${FormInput.ButtonYes}`,
  input_button_no: `form.${FormInput.ButtonNo}`,
  input_button_skip: `form.${FormInput.ButtonSkip}`,
  input_modal: `form.${FormInput.Modal}`,
  input_modal_trigger: `form.${FormInput.ModalTrigger}`,
  input_modal_value: `form.${FormInput.ModalValue}`,
  input_select: `form.${FormInput.Select}`,
}

export const formErrors = {
  formNotFound: new BotErrorMessage(
    "The form associated with this button no longer exists.",
  ).toJSON(),
  formChannelNotFound: new BotErrorMessage(
    "The form channel associated with this button no longer exists.",
  ).toJSON(),
  formThreadNotFound: new BotErrorMessage(
    "The form thread associated with this button no longer exists.",
  ).toJSON(),
  submissionsChannelNotFound: (embed?: boolean) =>
    embed
      ? new BotErrorMessage({
          title: "Form submission failed",
          description:
            "The submissions channel associated with this form no longer exists.",
        }).toJSON()
      : new BotErrorMessage(
          "The submissions channel associated with this form no longer exists.",
        ).toJSON(),
  missingSubmitPermissions: (embed?: boolean) =>
    embed
      ? new BotErrorMessage({
          title: "Form submission failed",
          description:
            "I do not have the `SEND_MESSAGES` permission in the form submissions channel, which is required to perform this action.",
        }).toJSON()
      : new BotErrorMessage(
          "I do not have the `SEND_MESSAGES` permission in the form submissions channel, which is required to perform this action.",
        ).toJSON(),
}
