// @ts-check
const { withBlitz } = require("@blitzjs/next")

/**
 * @type {import('@blitzjs/next').BlitzConfig}
 **/
const config = {
  i18n: {
    locales: [ 'de', 'en' ],
    localeDetection: false,
    defaultLocale: 'en'
  }
}

module.exports = withBlitz(config)
