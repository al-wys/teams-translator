import {
  TeamsActivityHandler,
  TurnContext,
  MessageFactory,
  MessagingExtensionAction,
  MessagingExtensionActionResponse
} from "botbuilder";

import * as Util from "util";
const TextEncoder = Util.TextEncoder;

import * as debug from "debug";
const log = debug("msteams");

export class TranslatorBot extends TeamsActivityHandler {
  constructor() {
    super();
  }

  protected handleTeamsMessagingExtensionFetchTask(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
    let result: string | undefined = "";
    if (action.messagePayload && action.messagePayload.body) {
      result = action.messagePayload.body.textContent;
    }
    const response: MessagingExtensionActionResponse = {
      task: {
        type: "message",
        value: result
      }
    } as MessagingExtensionActionResponse;

    return Promise.resolve(response);
  }
}
