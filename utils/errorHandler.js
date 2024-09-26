const logger = require('./logger');

async function errorHandler(interaction, error) {
    logger.error(`Error in command ${interaction.commandName}: ${error.message}`);
    
    const errorMessage = 'An error occurred while processing your request.';
    
    if (interaction.deferred) {
        await interaction.editReply(errorMessage).catch(console.error);
    } else if (!interaction.replied) {
        await interaction.reply({ content: errorMessage, ephemeral: true }).catch(console.error);
    }
}

module.exports = { errorHandler };
