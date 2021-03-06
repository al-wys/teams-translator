// Open in Google Translator: https://translate.google.com/?source=gtx_m#view=home&op=translate&sl=auto&tl=zh-CN&text=

export interface ITranslationResult {
  ok: boolean;
  msg?: string;
  result?: string;
  url?: string;
}

export interface ITranslationService {
  translatorTitle: string;

  translate(text: string, targetLanguage: "en" | "zh-CN" | "zh-TW"): Promise<ITranslationResult>;
}
