const discord = require("discord.js")

const Guild = require("../../models/guild.js")
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")

const ms = require("parse-ms")

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
          workName: false,
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
  
   let money = ecoDB.balance
  if(money === null ) money = 0
  let bankMoney = ecoDB.bankBalance
  if(bankMoney === null) bankMoney = 0
  let bankSpace = ecoDB.bankSpace
  if(bankSpace === null) bankSpace = 0
  
  
  const language = require(`../../data/language/${guildDB.language}.json`)
  
  let prefix = guildDB.prefix
  
  let user = message.author;
    let author = ecoDB.searchTime

    let timeout = 60000;

    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = ms(timeout - (Date.now() - author));
    
        let timeEmbed = new discord.MessageEmbed()
        .setColor(client.color.red)
        .setTitle(language.searchTime.replace("{timeMinute}", time.minutes).replace("{timeSecond}", time.seconds));
        message.channel.send(timeEmbed)
    } else {
  let places = language.searchPlaces
  let place = Math.floor(Math.random() * places.length)
  let place2 = Math.floor(Math.random() * places.length)
  let place3 = Math.floor(Math.random() * places.length)
  
  let filter = m => m.author.id === message.author.id
  
  message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setDescription(language.searchToChoose.replace("{place1}", places[place]).replace("{place2}", places[place2]).replace("{place3}", places[place3])))
  .then(() => message.channel.awaitMessages(filter, {max: 1, time: 60000}))
  .then(async collected => {
    let arr = [places[place] , places[place2] , places[place3]]
  let choice = collected.first().content.toLowerCase()
  
  if(arr.includes(choice)){
    let am = await Math.floor(Math.random() * 500)
    console.log(eco.balance + am)
    await eco.updateOne({
      balance: eco.balance + Number(am)
    })

    message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setDescription(language.searchSucceed.replace("{place}", choice).replace("{money}", am).replace("{emoji}", client.emoji.cash)))
  }
    
    if(!arr.includes(choice)){
     message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.searchInvalidChoice))
    }
    await eco.updateOne({
     searchTime: Date.now()
   })
  })
  }
}

module.exports.help = {
  name: "search",
  aliases: ["scout"],
  description: "Search in some places, and you might get some money",
  usage: " ",
  category: "economy"
}