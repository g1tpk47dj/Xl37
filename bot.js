// bot.js
const { Telegraf } = require('telegraf');

// Ganti dengan token kamu
const bot = new Telegraf('ISI_TOKEN_BOT_DI_SINI');

bot.start((ctx) => {
  ctx.reply('Halo! Aku adalah bot Telegram kamu 👋');
});

bot.on('text', (ctx) => {
  ctx.reply(`Kamu bilang: "${ctx.message.text}"`);
});

bot.launch();

console.log('🤖 Bot sedang berjalan...');