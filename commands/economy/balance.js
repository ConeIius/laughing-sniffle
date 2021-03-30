const discord = require("discord.js")

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
  
  const eco = await Economy.findOne(
    {
      userid: message.author.id
    },
    (err, user) => {
      if (err) console.error(err);
      if (!user) {
        const newGuild = new Economy({
          _id: mongoose.Types.ObjectId(),
          userid: message.author.id,
          job: null,
          balance: null,
          bankBalance: null,
          bankSpace: 100,
          minAmount: null,
          maxAmount: null,
          searchTime: null,
          workTime: null,
          workSucceed: null,
          workName: null,
          workHas: false
        });

        newGuild
          .save()
          .then(result => console.log(result))
          .catch(err => console.error(err));
        
        return message.channel.send('You were not in our database! We have added it, please retype this command.').then(m => m.delete({timeout: 10000}));
      }
    }
  );
  
  const guildDB = await Guild.findOne({
    guildID: message.guild.id
  });
  
  const ecoDB = await Economy.findOne({
    userid: user.id
  })
  
  const language = require(`../../data/language/${guildDB.language}.json`)
  
  let prefix = guildDB.prefix

  let money = ecoDB.balance
  if(money === null ) money = 0
  let bankMoney = ecoDB.bankBalance
  if(bankMoney === null) bankMoney = 0
  let bankSpace = ecoDB.bankSpace
  if(bankSpace === null) bankSpace = 0
  
  let basicmath = Number(money) + Number(bankMoney)
  
  const embed = new discord.MessageEmbed()
  .setColor(client.color.blue)
  .addField("**"+ language.balanceTitle.replace("{user}", user.username)+"**", language.balanceCheck.replace("{money}", `${money}`).replace("{emoji}", client.emoji.cash).replace("{bank}", `${bankMoney}`).replace("{bankspace}", `${bankSpace}`).replace("{total}", basicmath))
  
  message.channel.send(embed)
  
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
  name: "balance",
  aliases: ["bal"],
  description: "Check yours or someone elses balance",
  usage: "(user)",
  category: "economy"
}