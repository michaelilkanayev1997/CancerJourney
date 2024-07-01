import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { I18nManager } from "react-native";

import en from "./en.json";
import he from "./he.json";
import ar from "./ar.json";
import ru from "./ru.json";

const resources = {
  en: { translation: en },
  he: { translation: he },
  ar: { translation: ar },
  ru: { translation: ru },
};

const getLocaleLanguage = () => {
  // Get the current locale
  const locale = Localization.getLocales()[0].languageCode;
  // Map "iw" to "he"
  return locale === "iw" ? "he" : locale;
};

i18n.use(initReactI18next).init({
  resources,
  lng: getLocaleLanguage() ?? "en", // Use device's locale by default
  supportedLngs: ["en", "he", "ar", "ru"],
  compatibilityJSON: "v3",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already safes from xss
  },
});

// Update the app's RTL layout based on the selected language
const updateLayoutDirection = (language: string) => {
  const isRTL = ["he", "ar"].includes(language);

  // Force RTL if the language is Hebrew or Arabic
  I18nManager.forceRTL(isRTL);
  // Allow RTL if the language is Hebrew or Arabic, otherwise allow LTR
  I18nManager.allowRTL(isRTL);
};

i18n.on("languageChanged", (lng) => {
  updateLayoutDirection(lng);
});

export default i18n;
