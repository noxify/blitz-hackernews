# HackerNews Clone with the BlitzJS Toolkit and NextJS

This is an example app which use HackerNews as inpiration to build an app with the new BlitzJS Toolkit.

## What's the difference to other Hackernews Clones?

This clone doesn't use the HackerNews API to show the entries,
it's more a "self-hosted hackernews".

## What's included

* Simple UI with tailwind
* User management ( login, signup etc. via BlitzJS )
* List entries
* Show entry details
* Hide entries
* Up-Vote entries
* Comments

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

Just run the following command 🤷🏿‍♂️

```sh
npm run dev
```

## Use a different database engine

By default the app uses a SQLite database - You can change it to what you want.

Here some helpful links which should help to change the db engine.

* https://blitzjs.com/docs/postgres
* https://www.prisma.io/docs/concepts/database-connectors

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
* My wife for being at a festival, so I had time to develop this app 🙈
* [@QuiiBz](https://github.com/QuiiBz) for creating the awesome [next-international](https://github.com/QuiiBz/next-international) package
