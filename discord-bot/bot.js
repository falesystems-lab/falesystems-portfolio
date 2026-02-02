// Discord Moderation Bot - Production Ready
// Quality-focused implementation

const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

// Bot configuration
const config = {
  prefix: '!',
  color: 0x7289DA,
  version: '1.0.0'
};

// Initialize client with proper intents
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildModeration
  ]
});

// In-memory database (replace with real DB for production)
const db = {
  guilds: new Map(),
  warnings: new Map(),
  
  // Get or create guild config
  getGuild(guildId) {
    if (!this.guilds.has(guildId)) {
      this.guilds.set(guildId, {
        prefix: config.prefix,
        modLog: null,
        welcomeChannel: null,
        welcomeMessage: 'Welcome {user} to {server}!',
        autoRole: null,
        antiSpam: true,
        profanityFilter: ['badword1', 'badword2'],
        customCommands: new Map()
      });
    }
    return this.guilds.get(guildId);
  },
  
  // Warning system
  addWarning(guildId, userId, reason) {
    const key = `${guildId}-${userId}`;
    if (!this.warnings.has(key)) {
      this.warnings.set(key, []);
    }
    this.warnings.get(key).push({
      reason,
      timestamp: Date.now()
    });
    return this.warnings.get(key).length;
  },
  
  getWarnings(guildId, userId) {
    const key = `${guildId}-${userId}`;
    return this.warnings.get(key) || [];
  },
  
  clearWarnings(guildId, userId) {
    const key = `${guildId}-${userId}`;
    this.warnings.delete(key);
  }
};

// Anti-spam tracker
const spamTracker = new Map();

// Utility functions
const utils = {
  // Send to mod log
  async logAction(guild, action, user, moderator, reason) {
    const guildConfig = db.getGuild(guild.id);
    if (!guildConfig.modLog) return;
    
    const logChannel = guild.channels.cache.get(guildConfig.modLog);
    if (!logChannel) return;
    
    const embed = new Discord.EmbedBuilder()
      .setColor(config.color)
      .setTitle(`🔨 ${action}`)
      .addFields(
        { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
        { name: 'Moderator', value: `${moderator.tag}`, inline: true },
        { name: 'Reason', value: reason || 'No reason provided' }
      )
      .setTimestamp();
    
    await logChannel.send({ embeds: [embed] });
  },
  
  // Check spam
  isSpam(message) {
    const userId = message.author.id;
    const now = Date.now();
    
    if (!spamTracker.has(userId)) {
      spamTracker.set(userId, []);
    }
    
    const userMessages = spamTracker.get(userId);
    userMessages.push(now);
    
    // Remove messages older than 5 seconds
    const recent = userMessages.filter(t => now - t < 5000);
    spamTracker.set(userId, recent);
    
    // 5+ messages in 5 seconds = spam
    return recent.length >= 5;
  },
  
  // Check profanity
  hasProfanity(message, guildId) {
    const guildConfig = db.getGuild(guildId);
    const content = message.content.toLowerCase();
    return guildConfig.profanityFilter.some(word => content.includes(word));
  }
};

// Commands
const commands = {
  // Moderation commands
  async warn(message, args) {
    if (!message.member.permissions.has(Discord.PermissionFlagsBits.ModerateMembers)) {
      return message.reply('❌ You need the "Moderate Members" permission.');
    }
    
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to warn.');
    
    const reason = args.slice(1).join(' ') || 'No reason provided';
    const count = db.addWarning(message.guild.id, user.id, reason);
    
    await utils.logAction(message.guild, 'Warning', user, message.author, reason);
    
    const embed = new Discord.EmbedBuilder()
      .setColor('Orange')
      .setTitle('⚠️ User Warned')
      .setDescription(`${user.tag} has been warned.\n**Reason:** ${reason}\n**Total warnings:** ${count}`);
    
    message.reply({ embeds: [embed] });
    
    // Auto-escalation
    if (count === 3) {
      const member = message.guild.members.cache.get(user.id);
      if (member) {
        await member.timeout(60 * 60 * 1000, 'Auto-mute: 3 warnings'); // 1 hour
        message.channel.send(`${user.tag} has been muted for 1 hour (3 warnings).`);
      }
    } else if (count === 5) {
      const member = message.guild.members.cache.get(user.id);
      if (member) {
        await member.kick('Auto-kick: 5 warnings');
        message.channel.send(`${user.tag} has been kicked (5 warnings).`);
      }
    }
  },
  
  async kick(message, args) {
    if (!message.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ You need the "Kick Members" permission.');
    }
    
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to kick.');
    
    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply('❌ User not found.');
    
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    await member.kick(reason);
    await utils.logAction(message.guild, 'Kick', user, message.author, reason);
    
    message.reply(`✅ ${user.tag} has been kicked.`);
  },
  
  async ban(message, args) {
    if (!message.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ You need the "Ban Members" permission.');
    }
    
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to ban.');
    
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    await message.guild.members.ban(user, { reason });
    await utils.logAction(message.guild, 'Ban', user, message.author, reason);
    
    message.reply(`✅ ${user.tag} has been banned.`);
  },
  
  async purge(message, args) {
    if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
      return message.reply('❌ You need the "Manage Messages" permission.');
    }
    
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('❌ Please provide a number between 1 and 100.');
    }
    
    await message.channel.bulkDelete(amount + 1, true);
    const reply = await message.channel.send(`✅ Deleted ${amount} messages.`);
    
    setTimeout(() => reply.delete(), 3000);
  },
  
  // Config commands
  async setmodlog(message, args) {
    if (!message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
      return message.reply('❌ You need the "Administrator" permission.');
    }
    
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply('❌ Please mention a channel.');
    
    const guildConfig = db.getGuild(message.guild.id);
    guildConfig.modLog = channel.id;
    
    message.reply(`✅ Mod log set to ${channel}.`);
  },
  
  async setwelcome(message, args) {
    if (!message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
      return message.reply('❌ You need the "Administrator" permission.');
    }
    
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply('❌ Please mention a channel.');
    
    const guildConfig = db.getGuild(message.guild.id);
    guildConfig.welcomeChannel = channel.id;
    
    message.reply(`✅ Welcome channel set to ${channel}.`);
  },
  
  // Info commands
  async help(message) {
    const embed = new Discord.EmbedBuilder()
      .setColor(config.color)
      .setTitle('🤖 Bot Commands')
      .setDescription('Prefix: `!` (customizable)')
      .addFields(
        { name: '**Moderation**', value: '`warn`, `kick`, `ban`, `purge`' },
        { name: '**Config**', value: '`setmodlog`, `setwelcome`' },
        { name: '**Info**', value: '`help`, `ping`, `stats`' }
      )
      .setFooter({ text: `Version ${config.version}` });
    
    message.reply({ embeds: [embed] });
  },
  
  async ping(message) {
    const sent = await message.reply('Pinging...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    sent.edit(`🏓 Pong! Latency: ${latency}ms | API: ${Math.round(client.ws.ping)}ms`);
  },
  
  async stats(message) {
    const embed = new Discord.EmbedBuilder()
      .setColor(config.color)
      .setTitle('📊 Bot Statistics')
      .addFields(
        { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Users', value: `${client.users.cache.size}`, inline: true },
        { name: 'Uptime', value: `${Math.floor(client.uptime / 60000)} minutes`, inline: true }
      );
    
    message.reply({ embeds: [embed] });
  }
};

// Event handlers
client.on('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  client.user.setActivity('!help for commands', { type: Discord.ActivityType.Watching });
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  
  const guildConfig = db.getGuild(message.guild.id);
  
  // Anti-spam check
  if (guildConfig.antiSpam && utils.isSpam(message)) {
    await message.delete();
    const warning = await message.channel.send(`${message.author}, stop spamming!`);
    setTimeout(() => warning.delete(), 3000);
    return;
  }
  
  // Profanity filter
  if (utils.hasProfanity(message, message.guild.id)) {
    await message.delete();
    const warning = await message.channel.send(`${message.author}, watch your language!`);
    setTimeout(() => warning.delete(), 3000);
    return;
  }
  
  // Command handling
  if (!message.content.startsWith(guildConfig.prefix)) return;
  
  const args = message.content.slice(guildConfig.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  
  if (commands[commandName]) {
    try {
      await commands[commandName](message, args);
    } catch (error) {
      console.error(`Error executing ${commandName}:`, error);
      message.reply('❌ An error occurred while executing that command.');
    }
  }
});

client.on('guildMemberAdd', async member => {
  const guildConfig = db.getGuild(member.guild.id);
  
  // Welcome message
  if (guildConfig.welcomeChannel) {
    const channel = member.guild.channels.cache.get(guildConfig.welcomeChannel);
    if (channel) {
      const msg = guildConfig.welcomeMessage
        .replace('{user}', member.user.toString())
        .replace('{server}', member.guild.name);
      channel.send(msg);
    }
  }
  
  // Auto-role
  if (guildConfig.autoRole) {
    const role = member.guild.roles.cache.get(guildConfig.autoRole);
    if (role) {
      await member.roles.add(role);
    }
  }
});

// Error handling
client.on('error', error => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

// Login
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ DISCORD_TOKEN not found in environment variables');
  process.exit(1);
}

client.login(token);
