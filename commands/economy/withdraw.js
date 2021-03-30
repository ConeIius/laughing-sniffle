const discord = require("discord.js")

const Guild = require("../../models/guild.js")
const Economy = require("../../models/economy.js")
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
    userid: message.author.id
  })
  
  const language = require(`../../data/language/${guildDB.language}.json`)
  
  let prefix = guildDB.prefix
  
  let money = await ecoDB.balance
  if(money === null ) money = 0
  let bmoney = await ecoDB.bankBalance
  if(bmoney === null) bmoney = 0
  let bspace = await ecoDB.bankSpace
  if(bspace === null) bspace = 0
  
  let amount = args[0]
  
  if(!amount) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.withdrawMissingArg0))
 
  if(amount.toLowerCase() === "max" || amount.toLowerCase() === "all"){
  if(bmoney === 0 || bmoney === null) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.withdrawNoMoney))
    
    await eco.updateOne({
     bankBalance: bmoney - bmoney
   })
    await eco.updateOne({
      balance: money + bmoney
    })
    
    return message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setTitle(language.withdrawSuccessful.replace("{bankMoney}", bmoney).replace("{emoji}", client.emoji.cash)))
  }
  
  if(isNaN(amount)) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.withdrawIsNan))
  
  if(amount.includes("-")) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.withdrawNegative))
  
  if(amount === 0) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.withdrawNoMoney))
  
  if(amount > bmoney) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.withdrawMoreThanHave))
  
  
  await eco.updateOne({
    bankBalance: bmoney - Number(amount),
    
  })
  
  await eco.updateOne({
    balance: money + Number(amount)
  })

  
  message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setTitle(language.withdrawSuccessNumber.replace("{amount}", amount).replace("{emoji}", client.emoji.cash)))
}

module.exports.help = {
  name: "withdraw",
  aliases: ["with"],
  description: "Withdraw some money from your bank",
  usage: "<amount>",
  category: "economy"
}