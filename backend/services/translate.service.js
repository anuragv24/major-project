export async function translate(text, source, target) {
  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format: "text"
    })
  });

  const data = await res.json();
  return data.translatedText;
}