const { Client, Collection } = require("discord.js");
const discord = require("discord.js");
const { readdirSync } = require("fs");
const fs = require("fs");
const { sep } = require("path");
const { success, error, warning } = require("log-symbols");
const bot = new Client();

const mongoose = require("mongoose");
bot.mongoose = require("./utils/mongoose");
const Guild = require("./models/guild");
const Economy = require("./models/economy")

const emoji = require("./data/emoji");
bot.emoji = emoji;

const color = require("./data/colors");
bot.color = color;

const config = require("./data/config");
bot.config = config;

["commands", "aliases"].forEach(x => (bot[x] = new Collection()));

const load = (dir = "./commands/") => {
  readdirSync(dir).forEach(dirs => {
    const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files =>
      files.endsWith(".js")
    );

    for (const file of commands) {
      const pull = require(`${dir}/${dirs}/${file}`);
      if (
        pull.help &&
        typeof pull.help.name === "string" &&
        typeof pull.help.category === "string"
      ) {
        if (bot.commands.get(pull.help.name))
          return console.warn(
            `${warning} Two or more commands have the same name ${pull.help.name}.`
          );
        bot.commands.set(pull.help.name, pull);
        console.log(`${success} Loaded command ${pull.help.name}.`);
      } else {
        console.log(
          `${error} Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`
        );
        continue;
      }
      if (pull.help.aliases && typeof pull.help.aliases === "object") {
        pull.help.aliases.forEach(alias => {
          if (bot.aliases.get(alias))
            return console.warn(
              `${warning} Two commands or more commands have the same aliases ${alias}`
            );
          bot.aliases.set(alias, pull.help.name);
        });
      }
    }
  });
};

load();

bot.on("ready", () => {
  console.log("I am online");
  bot.mongoose.init();
});

bot.on("message", async message => {
  if (message.author.bot || !message.guild) return;

  await Guild.findOne(
    {
      guildID: message.guild.id
    },
    (err, guild) => {
      if (err) console.error(err);
      if (!guild) {
        const newGuild = new Guild({
          _id: mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          prefix: bot.config.prefix,
          language: "english"
        });

        newGuild
          .save()
          .then(result => console.log(result))
          .catch(err => console.error(err));
      }
    }
  );
  
  
  await Economy.findOne(
    {
      userid: message.author.id
    },
    (err, guild) => {
      if (err) console.error(err);
      if (!guild) {
        const newGuild = new Guild({
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
      }
    }
  );

  const guildDB = await Guild.findOne({
    guildID: message.guild.id
  });

  let prefix = guildDB.prefix;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();
  let command;

  if (!message.member)
    message.member = await message.guild.fetchMember(message.author);

  if (!message.content.startsWith(prefix)) return;

  if (cmd.length === 0) return;
  if (bot.commands.has(cmd)) command = bot.commands.get(cmd);
  else if (bot.aliases.has(cmd))
    command = bot.commands.get(bot.aliases.get(cmd));

  if (command) command.run(bot, message, args);
});

bot.login(process.env.TOKEN).catch(console.error());
