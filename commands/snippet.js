const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateCodeSnippet } = require('../utils/codeGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snippet')
        .setDescription('Get an AI-generated code snippet')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('The programming language')
                .setRequired(true)
                .addChoices(
                    { name: 'JavaScript', value: 'javascript' },
                    { name: 'Python', value: 'python' },
                    { name: 'Java', value: 'java' },
                    { name: 'C++', value: 'cpp' },
                    { name: 'C#', value: 'csharp' },
                    { name: 'Ruby', value: 'ruby' },
                    { name: 'Go', value: 'go' },
                    { name: 'PHP', value: 'php' },
                    { name: 'Swift', value: 'swift' },
                    { name: 'Kotlin', value: 'kotlin' },
                    { name: 'Assembly', value: 'assembly' }
                ))
        .addStringOption(option =>
            option.setName('difficulty')
                .setDescription('The difficulty level')
                .setRequired(true)
                .addChoices(
                    { name: 'Beginner', value: 'beginner' },
                    { name: 'Intermediate', value: 'intermediate' },
                    { name: 'Advanced', value: 'advanced' },
                    { name: 'Expert', value: 'expert' }
                ))
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('The programming topic')
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();
        const startTime = Date.now();

        const language = interaction.options.getString('language');
        const difficulty = interaction.options.getString('difficulty');
        const topic = interaction.options.getString('topic') || 'general programming';

        try {
            const codeSnippet = await generateCodeSnippet(language, difficulty, topic);
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${language.charAt(0).toUpperCase() + language.slice(1)} Code Snippet`)
                .setDescription(`Difficulty: ${difficulty}\nTopic: ${topic}`)
                .addFields(
                    { name: 'Code', value: `\`\`\`${language}\n${codeSnippet}\n\`\`\`` }
                )
                .setFooter({ text: `Generated in ${responseTime}ms | Powered by Snippit Bot` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error in snippet command:", error);
            await interaction.editReply('An error occurred while generating the code snippet. Please try again.');
        }
    },
};
