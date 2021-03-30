const discord = require("discord.js")
const fetch = require("node-fetch")
const Guild = require("../../models/guild.js")
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")

module.exports.run = async (client, message, args) => {
  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || match(args.join(" ").toLowerCase(), message.guild) || message.author;

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
  

  //Ye put code here
   const data = await fetch(
      `https://nekobot.xyz/api/imagegen?type=awooify&url=${user.displayAvatarURL()}`
    ).then((res) => res.json());
  message.channel.send(new discord.MessageEmbed().setColor(client.color.blue).setImage(data.message));
  
  
  function match(msg, i) {
  if (!msg) return undefined;
  if (!i) return undefined;
  let user = i.members.cache.find(
    m =>
      m.user.username.toLowerCase().startsWith(msg) ||
      m.user.username.toLowerCase() === msg ||
      m.user.username.toLowerCase().includes(msg) ||
      m.displayName.toLowerCase().startsWith(msg) ||
      m.displayName.toLowerCase() === msg ||
      m.displayName.toLowerCase().includes(msg)
  );
  if (!user) return undefined;
  return user.user;
}
}

module.exports.help = {
  name: "awooify",
  aliases: [],
  description: "awooify someone!",
  usage: "(user)",
  category: "image"
}