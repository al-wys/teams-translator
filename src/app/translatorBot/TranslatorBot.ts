import {
  TeamsActivityHandler,
  TurnContext,
  MessagingExtensionAction,
  MessagingExtensionActionResponse,
  CardFactory,
  Attachment
} from "botbuilder";

import * as Util from "util";

import * as debug from "debug";
import { ITranslationService } from "../service/ITranslationService";
import GoogleTranslationService from "../service/GoogleTranslationService";

export class TranslatorBot extends TeamsActivityHandler {
  private readonly translationService: ITranslationService;

  constructor() {
    super();

    this.translationService = new GoogleTranslationService();
  }

  protected async handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
    switch (action.commandId) {
      case "newTransMsgAction":
        const targetLanguage = action.data.targetLanguage;
        const text = action.data.msg;

        return this.translateCommand(text, targetLanguage);
      default:
        throw new Error("NotImplemented");
    }
  }

  protected async handleTeamsMessagingExtensionFetchTask(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
    switch (action.commandId) {
      case "msgTransToZhAction":
        let msg: string | undefined;
        if (action.messagePayload && action.messagePayload.body) {
          msg = action.messagePayload.body.content || msg;
        }
        return this.translateCommand(msg, "zh-CN");
      default:
        throw new Error("NotImplemented");
    }
  }

  private async translateCommand(text: string | undefined, targetLanguage: "zh-CN" | "zh-TW" | "en"): Promise<MessagingExtensionActionResponse> {
    if (text) {
      const result = await this.translationService.translate(text, targetLanguage);

      if (result.ok) {
        // const card = this.createTranslationResultCard(result.result!, `Open in ${this.translationService.translatorTitle}`, result.url);
        const card = this.createTranslationResultCard(targetLanguage + "\n" + result.url, `Open in ${this.translationService.translatorTitle}`, result.url);
        return this.createActionResponse("翻译结果", card);
      } else {
        // The status of reponse is not 'OK'
        const card = this.createTranslationResultCard(`Message from translator service: **${result.msg}**`);
        return this.createActionResponse("Error", card);
      }
    } else {
      // no message
      return this.createActionResponse("Error", this.createTranslationResultCard("No Messages Here."));
    }
  }

  private createActionResponse(title: string, card: Attachment): MessagingExtensionActionResponse {
    return {
      task: {
        type: "continue",
        value: {
          title,
          height: "small",
          width: "small",
          card
        }
      }
    } as MessagingExtensionActionResponse;
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
