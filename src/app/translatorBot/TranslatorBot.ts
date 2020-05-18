import {
  TeamsActivityHandler,
  TurnContext,
  MessagingExtensionAction,
  MessagingExtensionActionResponse,
  CardFactory,
  Attachment
} from "botbuilder";

import * as Util from "util";
const TextEncoder = Util.TextEncoder;

import * as debug from "debug";
import { ITranslationService, ITranslationResult } from "../service/ITranslationService";
import GoogleTranslationService from "../service/GoogleTranslationService";
const log = debug("msteams");

export class TranslatorBot extends TeamsActivityHandler {
  private readonly translationService: ITranslationService;

  constructor() {
    super();

    this.translationService = new GoogleTranslationService();
  }

  protected handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
    return this.handleTeamsMessagingExtensionFetchTask(context, action);
  }

  protected async handleTeamsMessagingExtensionFetchTask(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
    let msg: string | undefined;
    if (action.messagePayload && action.messagePayload.body) {
      msg = action.messagePayload.body.content || msg;
    }

    if (msg) {
      const result = await this.translationService.translate(msg, "zh-cn");

      if (result.ok) {
        return {
          task: {
            type: "continue",
            value: {
              title: "翻译结果",
              height: "small",
              width: "small",
              card: this.createTranslationResultCard(result.result!, `Open in ${this.translationService.translatorTitle}`, (result.url!).toString())
            }
          }
        } as MessagingExtensionActionResponse;
      } else {
        // The status of reponse is not 'OK'
        return {
          task: {
            type: "continue",
            value: {
              title: "Error",
              height: "small",
              width: "small",
              card: this.createTranslationResultCard(`Message from translator service: **${result.msg}**`)
            }
          }
        } as MessagingExtensionActionResponse;
      }
    } else {
      // no message
      return {
        task: {
          type: "continue",
          value: {
            title: "Error",
            height: "small",
            width: "small",
            card: this.createTranslationResultCard("No Messages Here.")
          }
        }
      } as MessagingExtensionActionResponse;
    }

    // const adaptiveCard = CardFactory.adaptiveCard({
    //   body: [
    //     {
    //       type: "Container",
    //       items: [
    //         {
    //           type: "TextBlock",
    //           text: msg,
    //           wrap: true
    //         }
    //       ]
    //     }
    //   ],
    //   actions: [
    //     {
    //       type: "Action.OpenUrl",
    //       title: "Open in Bing",
    //       url: "https://bing.com"
    //     }
    //   ],
    //   type: "AdaptiveCard",
    //   version: "1.2"
    // });

    // const response: MessagingExtensionActionResponse = {
    //   task: {
    //     type: "continue",
    //     value: {
    //       title: msg,
    //       height: "small",
    //       width: "small",
    //       card: adaptiveCard
    //     }
    //   }
    // } as MessagingExtensionActionResponse;

    // // const response: MessagingExtensionActionResponse = {
    // //   task: {
    // //     type: "message",
    // //     value: result
    // //   }
    // // } as MessagingExtensionActionResponse;

    // return Promise.resolve(response);
  }

  private createTranslationResultCard(text: string, linkTitle?: string, linkUrl?: string): Attachment {
    const card: any = {
      body: [
        {
          type: "Container",
          items: [
            {
              type: "TextBlock",
              text,
              wrap: true
            }
          ]
        }
      ],
      type: "AdaptiveCard",
      version: "1.2"
    };

    if (linkTitle && linkUrl) {
      card.actions = [
        {
          type: "Action.OpenUrl",
          title: linkTitle,
          url: linkUrl
        }
      ];
    } else {
      card.body[0].items[0].color = "Attention";
    }

    return CardFactory.adaptiveCard(card);
  }
}
