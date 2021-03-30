const discord = require("discord.js")

const Guild = require("../../models/guild.js")
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")

module.exports.run = async (client, message, args) => {
  
  /*------ Guild Data ------*/
  
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
  
  /*-------- Economy Data ---------*/
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
  
  const ecoDB = await Economy.findOne({
    userid: message.author.id
  })
  
  
}

module.exports.help = {
  name: "commandName",
  aliases: ["commandAlias", "commandAlias2"],
  description: "commandDescription",
  usage: "commandUsage", //Dont type the command name or prefix just how to use it
  category: "commandCategory" //Must be the same as the folder name
}