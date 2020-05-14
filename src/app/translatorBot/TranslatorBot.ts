import {
  TeamsActivityHandler,
  TurnContext,
  MessagingExtensionAction,
  MessagingExtensionActionResponse,
  CardFactory
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
    let result = "No Message";
    if (action.messagePayload && action.messagePayload.body) {
      result = action.messagePayload.body.content || result;
    }

    const adaptiveCard = CardFactory.adaptiveCard({
      body: [
        {
          type: "Container",
          items: [
            {
              type: "TextBlock",
              text: result,
              wrap: true
            }
          ]
        }
      ],
      actions: [
        {
          type: "Action.OpenUrl",
          title: "Open in Bing",
          url: "https://bing.com"
        }
      ],
      type: "AdaptiveCard",
      version: "1.2"
    });

    const response: MessagingExtensionActionResponse = {
      task: {
        type: "continue",
        value: {
          title: result,
          height: "small",
          width: "small",
          card: adaptiveCard
        }
      }
    } as MessagingExtensionActionResponse;

    // const response: MessagingExtensionActionResponse = {
    //   task: {
    //     type: "message",
    //     value: result
    //   }
    // } as MessagingExtensionActionResponse;

    return Promise.resolve(response);
  }
}
