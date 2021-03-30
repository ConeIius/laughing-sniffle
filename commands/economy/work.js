const discord = require("discord.js")

const Guild = require("../../models/guild.js")
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")

const ms = require("parse-ms")
const randostrings = require("randostrings")
const random = new randostrings()
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
  
  //-----------------------------
  const language = require(`../../data/language/${guildDB.language}.json`)
  
  let prefix = guildDB.prefix
  
  if(!args[0]){
    let job = await eco.workName
    let minAmount = await eco.minAmount
    let maxAmount = await eco.maxAmount
    let hasJob = await eco.workHas
    if(hasJob === false || hasJob === null) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobNoHave.replace("{prefix}", prefix)))
    let user = message.author;
    let author = await eco.workTime

    let timeout = 120000;

    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = ms(timeout - (Date.now() - author));
    
        let timeEmbed = new discord.MessageEmbed()
        .setColor(client.color.red)
        .setTitle(language.workJobTime.replace("{timeMinute}", time.minutes).replace("{timeSecond}", time.seconds));
        message.channel.send(timeEmbed)
    } else {
      let randomGenerator = random.numberGenerator({
        min: Number(minAmount),
        max: Number(maxAmount)
      })
      let luck = random.numberGenerator({
        min: 1,
        max: 100
      })
      
      if(luck < 30){
     message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workFail))
      }
      
      if(luck > 30){
        await eco.updateOne({
      balance: eco.balance + Number(randomGenerator)
    })
        await eco.updateOne({
      workSucceed: eco.workSucceed + Number(1)
    })
        message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setTitle(language.workSucceed.replace("{moneyAmount}", randomGenerator).replace("{emoji}", client.emoji.cash)))
      }
    
      await eco.updateOne({
      workTime: Date.now()
    })
    return
    }
  }
  
  if(!["info", "job", "quit"].includes(args[0].toLowerCase())) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workInvalidArg0.replace("{array}", ["info", "job", "quit"].join(", "))))
  
  let emoji;
  let jobArtist = language.workJobArtist
  let jobChef = language.workJobChef
  let jobFirefighter = language.workJobFirefighter
  let jobDoctor = language.workJobDoctor
  let jobTeacher = language.workJobTeacher
  
  let jobArtist1
  let jobChef1
  let jobFirefighter1
  let jobDoctor1
  let jobTeacher1
  
  let succeed = await eco.workSucceed
  if(succeed === null) succeed = 0
    if(succeed < 0 || succeed === null || succeed === 0){
    jobArtist1 = jobArtist.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobChef1 = jobChef.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobFirefighter1 = jobFirefighter.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobDoctor1 = jobDoctor.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobTeacher1 = jobTeacher.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
  }
  if(succeed > 0 || succeed === null){
    jobArtist1 = jobArtist.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobChef1 = jobChef.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobFirefighter1 = jobFirefighter.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobDoctor1 = jobDoctor.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobTeacher1 = jobTeacher.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
  }
  if(succeed > 10){
    jobArtist1 = jobArtist.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobChef1 = jobChef.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobFirefighter1 = jobFirefighter.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobDoctor1 = jobDoctor.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobTeacher1 =jobTeacher.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
  }
  if(succeed > 25){
    jobArtist1 = jobArtist.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobChef1 = jobChef.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobFirefighter1 = jobFirefighter.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobDoctor1 = jobDoctor.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobTeacher1 = jobTeacher.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
  }
  if(succeed > 38){
    jobArtist1 = jobArtist.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobChef1 = jobChef.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobFirefighter1 = jobFirefighter.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobDoctor1 = jobDoctor.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobTeacher1 = jobTeacher.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
  }
  if(succeed > 46){
    jobArtist1 = jobArtist.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobChef1 = jobChef.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobFirefighter1 = jobFirefighter.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobDoctor1 = jobDoctor.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobTeacher1 = jobTeacher.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
  }
  
  if(args[0].toLowerCase() === "info"){
    const embed = new discord.MessageEmbed()
    /* Pages */
    //Page 1
    if(args[1] === "1" || !args[1]){
      embed.setColor(client.color.blue)
      embed.setTitle(language.workJobTitle)
      embed.setDescription(`${jobArtist1}\n${jobChef1}\n${jobFirefighter1}\n${jobDoctor1}\n${jobTeacher1}`)
      embed.setFooter(language.workJobPage + " 1/2")
    }
    
    
    let jobLifeguard = language.workJobLifeguard
    let jobDetective = language.workJobDetective
    let jobFarmer = language.workJobFarmer
    let jobButcher = language.workJobButcher
    let jobLawyer = language.workJobLawyer
    
    let jobLifeguard1
    let jobDetective1
    let jobFarmer1
    let jobButcher1
    let jobLawyer1
    
    
    if(succeed < 68){
    jobLifeguard1 = jobLifeguard.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobDetective1 = jobDetective.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobFarmer1 = jobFarmer.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobButcher1 = jobButcher.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobLawyer1 = jobLawyer.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
  }
      if(succeed > 68){
    jobLifeguard1 = jobLifeguard.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobDetective1 = jobDetective.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobFarmer1 = jobFarmer.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobButcher1 = jobButcher.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobLawyer1 = jobLawyer.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
  }
  if(succeed > 78){
    jobLifeguard1 = jobLifeguard.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobDetective1 = jobDetective.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobFarmer1 = jobFarmer.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobButcher1 = jobButcher.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobLawyer1 = jobLawyer.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
  }
  if(succeed > 89){
    jobLifeguard1 = jobLifeguard.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobDetective1 = jobDetective.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobFarmer1 = jobFarmer.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobButcher1 = jobButcher.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
    jobLawyer1 = jobLawyer.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
  }
  if(succeed > 100){
    jobLifeguard1 = jobLifeguard.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobDetective1 = jobDetective.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobFarmer1 = jobFarmer.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobButcher1 = jobButcher.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobLawyer1 = jobLawyer.replace("{emoji}", client.emoji.x).replace("{prefix}", prefix)
  }
  if(succeed > 112){
    jobLifeguard1 = jobLifeguard.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobDetective1 = jobDetective.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobFarmer1 = jobFarmer.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobButcher1 = jobButcher.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
    jobLawyer1 = jobLawyer.replace("{emoji}", client.emoji.check).replace("{prefix}", prefix)
  }
    
    //Page 2
    if(args[1] === "2"){
      embed.setColor(client.color.blue)
      embed.setTitle(language.workJobTitle)
embed.setDescription(`${jobLifeguard1}\n${jobDetective1}\n${jobFarmer1}\n${jobButcher1}\n${jobLawyer1}`)
      embed.setFooter(language.workJobPage + " 2/2")
    }
    
    message.channel.send(embed)    
  }
  
  if(args[0].toLowerCase() === "job"){
    let jobs = ["artist", "chef", "firefighter", "doctor", "teacher", "lifeguard", "detective", "farmer", "butcher", "lawyer"]
    if(!args[1]) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobInvalidArg0.replace("{prefix}", prefix)))
    if(!jobs.includes(args[1].toLowerCase())) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobInvalidArg0.replace("{prefix}", prefix)))
    
    let hasJob = await eco.workHas
    if(hasJob !== null) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workHasJob.replace("{prefix}", prefix)))
    

    
    let succeed = await eco.workSucceed
    
    let work = args[1]   
    
    if(args[1].toLowerCase() === "artist"){
      await eco.updateOne({
        workName: args[1].toLowerCase(),
        minAmount: Number(1),
        maxAmount: Number(250),
        workHas: true
    })
    }
    if(args[1].toLowerCase() === "chef"){
      if(succeed < 10) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobNotEnoughSucceed.replace("{userJob}", args[1].toLowerCase())))
      
      await eco.updateOne({
        workName: args[1].toLowerCase(),
        minAmount: Number(250),
        maxAmount: Number(500),
        workHas: true
    })
    }
    if(args[1].toLowerCase() === "firefighter"){
      if(succeed < 25) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobNotEnoughSucceed.replace("{userJob}", args[1].toLowerCase())))
      
      await eco.updateOne({
        workName: args[1].toLowerCase(),
        minAmount: Number(500),
        maxAmount: Number(1000),
        workHas: true
    })
    }
    
    if(args[1].toLowerCase() === "doctor"){
      if(succeed < 38) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobNotEnoughSucceed.replace("{userJob}", args[1].toLowerCase())))
      
      await eco.updateOne({
        workName: args[1].toLowerCase(),
        minAmount: Number(1000),
        maxAmount: Number(1500),
        workHas: true
    })
    }
    
    if(args[1].toLowerCase() === "teacher"){
      if(succeed < 46) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobNotEnoughSucceed.replace("{userJob}", args[1].toLowerCase())))
      
      await eco.updateOne({
        workName: args[1].toLowerCase(),
        minAmount: Number(1500),
        maxAmount: Number(3000),
        workHas: true
    })
    }
    
    if(args[1].toLowerCase() === "lifeguard"){
      if(succeed < 68) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobNotEnoughSucceed.replace("{userJob}", args[1].toLowerCase())))
      
      await eco.updateOne({
        workName: args[1].toLowerCase(),
        minAmount: Number(3000),
        maxAmount: Number(7500),
        workHas: true
    })
    }
    if(args[1].toLowerCase() === "detective"){
      if(succeed < 78) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobNotEnoughSucceed.replace("{userJob}", args[1].toLowerCase())))
      
      await eco.updateOne({
        workName: args[1].toLowerCase(),
        minAmount: Number(7500),
        maxAmount: Number(10000),
        workHas: true
    })
    }
    if(args[1].toLowerCase() === "farmer"){
      if(succeed < 89) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobNotEnoughSucceed.replace("{userJob}", args[1].toLowerCase())))
      
      await eco.updateOne({
        workName: args[1].toLowerCase(),
        minAmount: Number(10000),
        maxAmount: Number(15000),
        workHas: true
    })
    }
    if(args[1].toLowerCase() === "butcher"){
      if(succeed < 100) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobNotEnoughSucceed.replace("{userJob}", args[1].toLowerCase())))
      
      await eco.updateOne({
        workName: args[1].toLowerCase(),
        minAmount: Number(15000),
        maxAmount: Number(23500),
        workHas: true
    })
    }
    if(args[1].toLowerCase() === "lawyer"){
      if(succeed < 112) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workJobNotEnoughSucceed.replace("{userJob}", args[1].toLowerCase())))
      
      await eco.updateOne({
        workName: args[1].toLowerCase(),
        minAmount: Number(23500),
        maxAmount: Number(30000),
        workHas: true
    })
    }
    
    message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setTitle(language.workJobGot.replace("{newWork}", work.toLowerCase())))
  }
      if(args[0].toLowerCase() === "quit"){
      let hasJob = await eco.workHas
      if(hasJob === null || hasJob === false) return message.channel.send(new discord.MessageEmbed().setColor(client.color.red).setTitle(language.workHasNoJob.replace("{prefix}", prefix)))
      if(hasJob === true){
        
    await eco.updateOne({
          workName: null,
          minAmount: null,
          maxAmount: null,
          workHas: false
    })
      return message.channel.send(new discord.MessageEmbed().setColor(client.color.green).setTitle(language.workJobSuccessQuit))
      }
    }
  
  
}

module.exports.help = {
  name: "work",
  aliases: ["job"],
  description: "Get a job or just start working",
  usage: "(info) (job name | Page)",
  category: "Economy"
}