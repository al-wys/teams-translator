import { ITranslationService, ITranslationResult } from "./ITranslationService";

type GoogleTranslatorResult = string[][][];
const GOOGLE_TRANS_API: string = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&dt=t&tl=";
const GOOGLE_TRANS_PAGE_URL_PREFIX: string = "https://translate.google.com/?source=gtx_m#view=home&op=translate&sl=auto&tl=zh-CN&text=";

export default class GoogleTranslationService implements ITranslationService {
  public readonly translatorTitle: string = "Google Translator";

  public async translate(text: string, targetLanguage: "en" | "zh-cn" | "zh-tw"): Promise<ITranslationResult> {
    try {
      const response = await fetch(GOOGLE_TRANS_API + targetLanguage, {
        method: "post",
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: `q=${encodeURIComponent(text)}`
      });

      if (response.ok) {
        const result: GoogleTranslatorResult = await response.json();
        let translatedText: string = "";
        result[0].forEach(snippets => {
          translatedText += snippets[0];
        });

        return {
          ok: true,
          result: translatedText,
          url: new URL(GOOGLE_TRANS_PAGE_URL_PREFIX + encodeURIComponent(text))
        };
      } else {
        return {
          ok: false,
          msg: response.statusText
        };
      }
    } catch (error) {
      return {
        ok: false,
        msg: `Error when communicated with ${this.translatorTitle}. Please try again later.`
      };
    }
  }

}
