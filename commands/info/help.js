const discord = require("discord.js");
const { readdirSync } = require("fs");

const Guild = require("../../models/guild.js")
const mongoose = require("mongoose")

module.exports.run = async (bot, message, args) => {
  const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) console.error(err)
            if (!guild) {
                const newGuild = new Guild({
                  _id: mongoose.Types.ObjectId(),
                  guildID: message.guild.id,
                  guildName: message.guild.name,
                  prefix: bot.config.prefix,
                  language: "english"
                })

                newGuild.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));

                return message.channel.send('This server was not in our database! We have added it, please retype this command.').then(m => m.delete({timeout: 10000}));
            }
        });
  
  const guildDB = await Guild.findOne({
    guildID: message.guild.id
  });
  const language = require(`../../data/language/${guildDB.language}.json`)
  
  let prefix = guildDB.prefix       
      
  const embed = new discord.MessageEmbed()
    .setColor(bot.color.blue)
    .setAuthor(`${prefix}Help`, bot.user.displayAvatarURL())
    .setTimestamp();
  
  if (args[0]) {
    let command = args[0];
    let cmd;
    if (bot.commands.has(command)) {
      cmd = bot.commands.get(command);
    } else if (bot.aliases.has(command)) {
      cmd = bot.commands.get(bot.aliases.get(command));
    }
    if (!cmd)
      return message.channel.send(embed.setColor(bot.color.red).setTitle(language.helpInvalidCommand).setDescription(language.helpInvalidListCommand.replace("{prefix}", prefix)));
    command = cmd.help;
    embed.setTitle(
      `${command.name.slice(0, 1).toUpperCase() +
        command.name.slice(1)} command help`
    );
    embed.setDescription(
      [
        `❯ **${language.helpCommand}:** ${command.name.slice(0, 1).toUpperCase() +
          command.name.slice(1)}`,
        `❯ **${language.helpDescription}:** ${command.description ||
          "No Description provided."}`,
        `❯ **${language.helpUsage}:** ${command.usage
            ? `\`${prefix}${command.name} ${command.usage}\``
            : "No Usage"
        } `,
        `❯ **${language.helpAlias}:** ${
          command.aliases ? command.aliases.join(", ") : "None"
        }`,
        `❯ **${language.helpCategory}:** ${
          command.category ? command.category : "General" || "Misc"
        }`,
        `❯ [${language.helpInviteBot}](https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8) - [${language.helpSupportServer}](https://discord.gg/xPCgftR5py)`
      ].join("\n")
    );

    return message.channel.send(embed);
  }
  const categories = readdirSync("./commands/");
  embed.setDescription(
    [
      `${language.helpInvalidListCommand.replace("{prefix}", prefix)}`,
      `[${language.helpInviteBot}](https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8)`,
      `[${language.helpSupportServer}](https://discord.gg/xPCgftR5py)`
    ].join("\n")
  );

  categories.forEach(category => {
    const dir = bot.commands.filter(
      c => c.help.category.toLowerCase() === category.toLowerCase()
    );

    const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

    try {      
      if (dir.size === 0) return;
      if (bot.config.owners.includes(message.author.id))
        embed.addField(
         `❯ ${capitalise}`,
          dir.map(c => `\`${c.help.name}\``).join(" | "),
          true
        );
      
      else if (category !== "developer")
        embed.addField(
           `❯ ${capitalise}`,
          dir.map(c => `\`${c.help.name}\``).join(" | "),
          true
        );
    } catch (e) {
      console.log(e);
    }
  });
  return message.channel.send(embed);
};


module.exports.help = {
  name: "help",
  aliases: [" "],
  description: "Help command to show the commands",
  usage: "(command name)",
  category: "info"
};