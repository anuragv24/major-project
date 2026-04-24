import { translate } from "./translate.service";


export async function safeTranslate(text, source, target) {
  try {
    return await translate(text, source, target);
  } catch (err) {
    return text;
  }
}