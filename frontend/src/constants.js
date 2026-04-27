// src/constants.js
export const SARVAM_LANGUAGES = [
    { code: "en", name: "English" }, { code: "hi", name: "Hindi" }, { code: "bn", name: "Bengali" },
    { code: "as", name: "Assamese" }, { code: "brx", name: "Bodo" }, { code: "doi", name: "Dogri" },
    { code: "gu", name: "Gujarati" }, { code: "kn", name: "Kannada" }, { code: "ks", name: "Kashmiri" },
    { code: "gom", name: "Konkani" }, { code: "mai", name: "Maithili" }, { code: "ml", name: "Malayalam" },
    { code: "mni", name: "Manipuri" }, { code: "mr", name: "Marathi" }, { code: "ne", name: "Nepali" },
    { code: "or", name: "Odia" }, { code: "pa", name: "Punjabi" }, { code: "sa", name: "Sanskrit" },
    { code: "sat", name: "Santali" }, { code: "sd", name: "Sindhi" }, { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" }, { code: "ur", name: "Urdu" }
];

// Helper function to get name from code
export const getLanguageName = (code) => {
    const lang = SARVAM_LANGUAGES.find(l => l.code === code);
    return lang ? lang.name : "English";
};