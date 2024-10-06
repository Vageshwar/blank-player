const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
require('dotenv').config();

// Initialize client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,                  // For basic guild (server) interactions
        GatewayIntentBits.GuildVoiceStates,        // To manage voice states and play music
        GatewayIntentBits.GuildMessages,           // For reading messages
        GatewayIntentBits.MessageContent,          // To read the content of messages
        GatewayIntentBits.GuildMembers             // If your bot needs to interact with guild members
    ]
});

// Initialize the player (discord-player)
const player = new Player(client);

(async () => { 
    await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
})();

// Helper function to check if a string is a valid URL
function isValidURL(string) {
    try {
        let url_regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
        return url_regex.test(string);
    } catch (_) {
        return false;
    }
}

// Bot ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

try {
    // Music play command
client.on('messageCreate', async (message) => {
    // Split command and args
    const args = message.content.split(' ');
    const command = args[0].toLowerCase();
    const query = args.slice(1).join(' ');

    // Handle "!play" command
    if (command === '!play') {
        if (!message.member.voice.channel) return;
        if (!query) return await message.reply('Please provide a song name or a link to play.');

        // Create or get queue for the guild (server)
        const queue = player.nodes.create(message.guild, {
            metadata: {
                channel: message.channel
            }
        });

        try {
            // Connect to the voice channel if not connected
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.destroy();
            return await message.reply('Could not join your voice channel!');
        }

        // Detect if the query is a URL or a song name
        let track;
        if (isValidURL(query)) {
            track = await player.play(message.member.voice.channel, query, {
                requestedBy: message.author
            });
        } else {
            track = await player.search(query, {
                requestedBy: message.author
            }).then(x => x.tracks[0]);
        }

        if (!track) return await message.reply(`Track **${query}** not found!`);

        queue.addTrack(track);
        if (!queue.isPlaying()) await queue.node.play();
        return await message.reply(`Now playing **${track.title}**!`);
    }

    // Handle "!stop" command
    if (command === '!stop') {
        const queue = player.nodes.get(message.guild.id);
        if (queue) {
            queue.destroy(); // Stop playing and leave the voice channel
            return await message.reply('Stopped the music and cleared the queue.');
        } else {
            return await message.reply('No music is currently playing.');
        }
    }

    // Handle "!pause" command
    if (command === '!pause') {
        const queue = player.nodes.get(message.guild.id);
        if (queue && queue.node.isPlaying()) {
            queue.node.pause(); // Pause the music
            return await message.reply('Paused the music.');
        } else {
            return await message.reply('No music is currently playing.');
        }
    }

    // Handle "!resume" command
    if (command === '!resume') {
        const queue = player.nodes.get(message.guild.id);
        if (queue && queue.node.isPaused()) {
            queue.node.resume(); // Resume the music
            return await message.reply('Resumed the music.');
        } else {
            return await message.reply('The music is not paused or no music is playing.');
        }
    }

    // Handle "!clearqueue" command
    if (command === '!clearqueue') {
        const queue = player.nodes.get(message.guild.id);
        if (queue) {
            queue.clear(); // Clear the queue
            return await message.reply('Cleared the queue.');
        } else {
            return await message.reply('No queue to clear.');
        }
    }

    // Handle "!disconnect" command
    if (command === '!disconnect') {
        const queue = player.nodes.get(message.guild.id);
        if (queue && queue.connection) {
            queue.connection.disconnect(); // Disconnect from the voice channel
            return await message.reply('Disconnected from the voice channel.');
        } else {
            return await message.reply('Not connected to any voice channel.');
        }
    }

    // Handle "!queue" command
    if (command === '!queue') {
        const queue = player.nodes.get(message.guild.id);
        if (queue && queue.tracks.length > 0) {
            const queueList = queue.tracks.map((track, index) => `${index + 1}. **${track.title}** (requested by: ${track.requestedBy.username})`).join('\n');
            return await message.reply(`Current queue:\n${queueList}`);
        } else {
            return await message.reply('The queue is currently empty.');
        }
    }

    // Handle "!next" command
    if (command === '!next') {
        const queue = player.nodes.get(message.guild.id);
        if (queue && queue.node.isPlaying()) {
            const currentTrack = queue.current;
            queue.node.skip(); // Skip the current track and move to the next one
            return await message.reply(`Skipped **${currentTrack.title}**. Now playing the next track.`);
        } else {
            return await message.reply('No music is currently playing to skip.');
        }
    }
});
} catch (error) {
    console.log(error);
       
}

player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`Started playing **${track.cleanTitle}**!`);
});

// Bot login using token from .env
client.login(process.env.DISCORD_BOT_TOKEN);
