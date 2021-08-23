const { MessageEmbed } = require('discord.js')

module.exports = {
  // name stands for command name
	name: '8ball',
  // description stands for command description
	description: 'Ask the bot a question.',
  // options is an array, stands for command options
  // what you can do with these options you can see the docs
  // https://discord.js.org/#/docs/main/stable/typedef/ApplicationCommandOptionData
	options: [
		{
			type: 'STRING',
      name: "question",
      description: "Question to ask",
      required: true
		}
  ],

  // the execute function of this command
	execute(interaction) {
    const answers = [
        "是的",
        "Ask me later.", 
        "不要", 
        "我不知道awa",
        "Hello?",
        "Never.", 
        "Maybe.",
        "Hmm...",
        "Excuse me?"];

    // We use CommandInteraction#options.getString(OptionsName) to get an String options
    // More you can do with CommandInteraction#options you can see the docs
    // https://discord.js.org/#/docs/main/stable/class/CommandInteractionOptionResolver
    const question = interaction.options.getString('question');
    const answer = ~~(Math.random() * answers.length);

    const ballembed = new MessageEmbed()
        .setColor('#00b140')
        .setTitle('**8ball**')
        .setDescription(`**Your question**: ${question}\n**My answer**: ${answers[answer]}`)

    // reply the interaction with embed
    interaction.reply({
      embeds: [ballembed]
    });
	},
};
