# Discord Blindtest Bot

This project was created to organize blindtests on Discord. It is composed of a Discord bot to play music and a web interface to allow players to buzz.

## Goals

This project was created with the goal to play with friends during lockdown.

It was used as a opportunity to test new things, like the Discord bot API, and how to use WebSockets (without libs).

## Known Issues

This was built as a pet project and has some known issues that are not critical and therefore will probably not be fixed (soon).

## Features

- A Discord bot that plays music for the player to guess.
- A web interface for the player to buzz to guess the music.
- The music stops and the players interface color changes when a player buzzes.
- An admin web interface to manage the bot:
  - join or leave a channel,
  - play a music with the given Youtube hash,
  - a timer that starts when a player buzzes,
  - cancel a buzz for a player if he does not have the answer,
  - pause, stop or resume the current music.

## Installation

- Clone this repository.
- Install dependencies (`npm ci`.)
- Configure the bot by updating the `config.json` file.
- Run the bot (`node server.js`.)
- (optional) Expose the `public/` folder and send the link to the web interfaces to the players for the buzzer.

## Contributing

This project is not meant to be maintained regularly. It is only available for sharing.

If you want to contribute, you can open an issue or send a pull request but there is not guarantee that it will be taken into account.

If you have any feedback, please reach out and open a discussion on this repository.

## Feedback

If you have any feedback, please reach out by opening a discussion in this repository.

## License

MIT
