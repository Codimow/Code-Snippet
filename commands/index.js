const fs = require('fs');
const path = require('path');

function registerCommands(client) {
    const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'index.js');

    for (const file of commandFiles) {
        const command = require(`./${file}`);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
        }
    }
}

module.exports = { registerCommands };
