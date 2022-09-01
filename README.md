# HackerNews Clone with the BlitzJS Toolkit and NextJS

This is an example app which use HackerNews as inpiration to build an app with the new BlitzJS Toolkit.

## What's the difference to other Hackernews Clones?

This clone doesn't use the HackerNews API to show the entries,
it's more a "self-hosted hackernews".

## What's included

* Simple UI with tailwind
* List entries
* Show entry details
* Create new entries
* Hide entries
* Up-Vote entries
* Show comments ( nested, of course)
* Create new comments
* Up-Vote for comments
* Login & Signup

## TODO

- [ ] User profile ( show profile, update profile etc.)
- [ ] Save favorites

## What's not included

* No admin ui to manage the records
* No 3rd party login ( but you can add it easily )
* No api endpoints for now

## Installation

```sh
git clone git@github.com:noxify/blitz-hackernews.git
cd blitz-hackernews
npm i
```

## Run it locally

1. Update the `.env` file with some valid database credentials
2. Run the migrations via `npm run migrate:dev`
3. (Optional) Run the seeder to get some fake data via `npm run seed`
4. Start the dev server via `npm run dev`

## Use a different database engine

By default the app uses a postgres database - You can change it to what you want.

Here some helpful links which should help to change the db engine.

* https://www.prisma.io/docs/concepts/database-connectors

> I tried to get it running with SQLite, but then the seeder wasn't working, because `createMany` isn't supported with SQLite.

## Used packages
* BlitzJS
* NextJS
* Prisma
* TailwindCSS with TailwindUI component
* HeadlessUI
* Next-International

## Credits

* The [BlitzJS](https://blitzjs.com/) team - you're awesome
* The [TailwindCSS](https://tailwindcss.com/)/[TailwindUI](https://tailwindui.com/) team - thanks for the awesome components
* The VueJS team for the [theme inspiration](https://www.prisma.io/docs/concepts/database-connectors)
* [@QuiiBz](https://github.com/QuiiBz) for creating the awesome [next-international](https://github.com/QuiiBz/next-international) package
* Comment section is based on https://codesandbox.io/s/llmk22kz19
