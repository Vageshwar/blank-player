
# BLANK PLAYER - Discord Music Bot

A modular and feature-rich Discord music bot that allows users to play music, manage queues, and control playback. This bot is built using [discord.js](https://discord.js.org/) and [discord-player](https://discord-player.js.org/).

## Features

- Play music from various sources (except YouTube due to extractor exclusion)
- Pause, resume, skip, stop, and manage queues
- Commands for controlling playback and interacting with music queues
- Handles both URL and search queries for songs
- Easy to maintain and extend due to modular code structure

## Prerequisites

Before running this bot, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Discord Bot Token](https://discord.com/developers/applications)
- Discord.js and other dependencies (see below)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Vageshwar/blank-player.git
cd blank-player
```

### 2. Install Dependencies
Run the following command to install the required packages:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of your project and add your Discord bot token:
```
DISCORD_BOT_TOKEN=your-discord-bot-token-here
```

### 4. Running the Bot
To start the bot, run:
```bash
node index.js
```

## Commands

- **!play [song or URL]** - Play a song or a URL in the current voice channel
- **!stop** - Stops the music and clears the queue
- **!pause** - Pauses the currently playing song
- **!resume** - Resumes the paused song
- **!queue** - Shows the current song queue
- **!next** - Skips to the next song in the queue
- **!clearqueue** - Clears the song queue
- **!disconnect** - Disconnects the bot from the voice channel

## Project Structure [TODO]

```
/src
  ├── commands        # Command handlers for various bot commands
  ├── events          # Event handlers for discord events (messageCreate, playerStart)
  ├── utils           # Utility functions such as URL validation
  └── index.js        # Main entry file to initialize and run the bot
```

### Commands Directory
Each command (e.g., play, stop, pause) is placed in its own file for easy maintenance and modularity.

### Events Directory
Handles Discord events like `messageCreate` and `playerStart` to make the bot more responsive and interactive.

### Utils Directory
Contains utility functions that are used across different parts of the bot, such as `isValidURL`.

## Installation of Additional Modules

This bot uses several NPM packages. If you need to install additional modules, you can use the following command:
```bash
npm install <module-name>
```

Make sure to check out the [discord-player documentation](https://discord-player.js.org/) for more advanced usage and customization.

## Contributing

Feel free to submit issues or pull requests if you would like to contribute to this project.

## License

NA
