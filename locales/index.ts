import { createI18n } from "next-international"
import type Locale from "./en"

export const { useI18n, I18nProvider, getLocaleProps, useChangeLocale, defineLocale } = createI18n<
  typeof Locale
>({
  en: () => import("./en"),
  de: () => import("./de"),
})
