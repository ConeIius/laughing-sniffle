const discord = require("discord.js")

const Guild = require("../../models/guild.js")
const mongoose = require("mongoose")

module.exports.run = async (client, message, args) => {
  const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) console.error(err)
            if (!guild) {
                const newGuild = new Guild({
                  _id: mongoose.Types.ObjectId(),
                  guildID: message.guild.id,
                  guildName: message.guild.name,
                  prefix: client.config.prefix,
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
  
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.setPrefixInvalidPermission))
  
  if(!args[0]) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.setPrefixMissingArgument))
  
  if(args[0].length > 5) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.setPrefixLongLength))
  
  message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setTitle(language.setPrefixChange.replace("{prefix}", args[0])))
       await settings.updateOne({
            prefix: args[0]
        });
}

module.exports.help = {
  name: "setprefix",
  aliases: ["prefix"],
  descripiion: "Change the servers prefix",
  usage: "<prefix>",
  category: "configs"
}