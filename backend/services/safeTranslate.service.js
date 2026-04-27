import { translate } from "./translate.service.js";


export async function safeTranslate(text, source, target) {
  console.log("safeTrans called :: ")
  try {
    return await translate(text, source, target);
  } catch (err) {
    return text;
  }
}