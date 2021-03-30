const discord = require("discord.js")

const Guild = require("../../models/guild.js")
const mongoose = require("mongoose")

module.exports.run = async(client, message, args) => {
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
  
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.setLangInvalidPermission))
  
  let languages = ["english", "french", "spanish"]
  
  if(!args[0]) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.setLangMissingArgument))
  
  
  let setLangInvalidOption = language.setLangInvalidOption.replace("{languages}", languages.join(", "))
  if(!languages.includes(args[0].toLowerCase())) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(setLangInvalidOption))
  
  let setLangChange = language.setLangChange.replace("{language}", args[0].toLowerCase())
  message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setTitle(setLangChange))
  
  await settings.updateOne({
            language: args[0].toLowerCase()
        });
}

module.exports.help = {
  name: "setlang",
  aliases: ["setlanguage", "changelanguage"],
  description: "Change the bots language",
  usage: "<language>",
  category: "configs"
}