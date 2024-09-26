require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { registerCommands } = require('./commands');
const { errorHandler } = require('./utils/errorHandler');
const logger = require('./utils/logger');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    rest: { timeout: 60000 } // 60 seconds timeout
});
client.commands = new Collection();

client.once('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`);
    registerCommands(client);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        console.log(`Executing command: ${interaction.commandName}`);
        await command.execute(interaction);
        console.log('Command executed successfully');
    } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

async function handleExplainButton(interaction) {
    await interaction.reply({ content: 'Generating explanation...', ephemeral: true });
    // Implement explanation logic here
}

async function handleOptimizeButton(interaction) {
    await interaction.reply({ content: 'Optimizing code...', ephemeral: true });
    // Implement optimization logic here
}

const { REST, Routes } = require('discord.js');

const commands = [
    require('./commands/snippet').data.toJSON(),
    // Add other commands here
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error refreshing commands:', error);
    }
})();

client.login(process.env.DISCORD_TOKEN);
