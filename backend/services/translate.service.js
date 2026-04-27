export const translate = async (text, sourceLang, targetLang) => {
  if(!text || sourceLang === targetLang) {
    return text;
  }

  try {
    const response = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY,
      },
      body: JSON.stringify({
        input: text,
        source_language_code: sourceLang.includes("-") ? sourceLang : `${sourceLang}-IN`,
        target_language_code: targetLang.includes("-") ? targetLang : `${targetLang}-IN`,
        model: "sarvam-translate:v1"
      }),
    })

    const data = await response.json();
    return data.translated_text || text;
  } catch (error) {
    console.error("Sarvam Translation Error:", error.message);
    return text;
  }
}