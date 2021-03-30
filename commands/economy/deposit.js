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
    userid: message.author.id
  })
  
  
  const language = require(`../../data/language/${guildDB.language.toLowerCase()}.json`)
  
  let prefix = guildDB.prefix
  
  let money = ecoDB.balance
  if(money === null) money = 0
  let bmoney = ecoDB.bankBalance
  if(bmoney === null) bmoney = 0
  let bspace = ecoDB.bankSpace
  if(bspace === null) bspace = 0
  
  let amount = args[0]
  
  if(!amount) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.depositMissingArg0))
  
  if(amount.toLowerCase() === "max" || amount.toLowerCase() === "all"){
  if(money === 0 || money === null) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.depositNoMoney))
  if(bmoney === bspace) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.depositMaxBank))
      
      let adep = bspace - bmoney   
      let depo = 0
      
      if(money > adep){
        depo = adep
      } else {
        depo = money
      }
   await eco.updateOne({
     bankBalance: eco.bankBalance + depo
   })
    await eco.updateOne({
      balance: eco.balance - depo
    })
    return message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setTitle(language.depositSuccessfull.replace("{money}", depo)))
}
  if(amount.includes("-")) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.depositNegative))
  
  if(isNaN(amount)) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.depositIsNan))
  
    if(bmoney === bspace) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.depositMaxBank))

if(amount > money) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.depositNotEnoughMoney))

  let maxtodeposit = bspace - bmoney

  if(amount > maxtodeposit) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.depositBankNoFit))
  
  await eco.updateOne({
     bankBalance: eco.bankBalance + Number(amount)
   })
    await eco.updateOne({
      balance: eco.balance - Number(amount)
    })
  
  message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setTitle(language.depositSuccessNumber.replace("{amount}", amount).replace("{emoji}", client.emoji.cash)))
  
}

module.exports.help = {
  name: "deposit",
  aliases: ["dep"],
  description: "Deposit some money to your bank",
  usage: "<amount>",
  category: "economy"
}