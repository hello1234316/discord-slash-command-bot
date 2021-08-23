/* Please change the 'console' tab to 'shell'
  and type `npm start` to start the bot
  don't use the 'Run' button because it'll excute the bot with out dated node.js version */

// We use Object Destruct to avoid heavy code
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const { keep_alive } = require("./keep_alive");

// in v13, you have to specify your intents to login
const client = new Client({
  intents: ['GUILDS']
});

// comand collection
client.commands = new Collection();

// idk why this but i keep it
global.client = client;

// handle for unhandled promise rejection
process.on('unhandledRejection', error => {
    console.log(`UnhandledPromiseRejection : ${error}\n`)
});


// when the bot is ready
client.on('ready', async () => {
    
    // log the login information
    console.log(`\nLogged in : ${client.user.tag}\n`)

    // the ClientUser#setActivity and ClientUser#setPresence no longer return promise. This means you can't use .then with this method. They return the presence itself directly.
    const presence = client.user.setActivity(`with Romeo`, { type: "PLAYING" })

    // log the presence data
    console.log(`Set presense : ${presence.activities[0]}\n`);

    // read everything in the /commands folder that ends with `.js`
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    // go through the files
    for (const file of commandFiles) {
      // require the file
      const command = require(`./commands/${file}`);
      // set it to the client.commands
      client.commands.set(command.name, command);
    }

    /* 
       This part was written in a tricky way.
       Basically you can seperate this line with these codes:

       const guild = client.guilds.cache.get('ID');

       const guildCommandManager = guilds.commands;

       guildCommandManager.set([...client.commands.values()]);


       the first line is getting the target guild

       second line is get the target guild's command manager, can be done easily by using Guild#commands property

       third line is using GuildCommandManager#set to bulk update the commands in the manager.
       this method take an array as parameter
       we use the ... operator to seperate the Collection#values(), to help us make the code cleanner.
    */
    client.guilds.cache.get('808945802100736050').commands.set([
      ...client.commands.values()
    ]).then(console.log);

    /* 
       This is basically how you set up the guild commands
       Once you're gonna publish your app, you can use

        client.application.commands.set() 

      to set up the global commands

      notice global commands has an one hour cache means your updates need to be waited least an hour to be shown up in Discord client

    */
    
});


// Listen to interactionCreate event
client.on('interactionCreate', async interaction => {

  // We only listen about CommandInteraction
  // There are still other kind of interaction like Context Menu and Message components
  if (!interaction.isCommand()) return;

  // get command by name
  // note CommandInteraction#commandName is the excuted command
  const command = client.commands.get(interaction.commandName);

  // if there are no such command reply the user that the command isn't exist
  // the ephemral:true stands for only the executor can see this reply
  if (!command) return interaction.reply({
    content: 'This command does not exist',
    ephemeral: true
  })

  try {
    // execute the command by passing interaction as its param
    await command.execute(interaction);
  } catch (error) {
    // once the error occurred
    // reply ephemerally we messages
    interaction.reply({
      content: 'An error has occurred',
      ephemeral: true
    });

    // then log it
    console.log(`Error from command ${command.name} : ${error.message}`);
    console.log(`${error.stack}\n`);
  }
    
})

client.login('TOKEN');
