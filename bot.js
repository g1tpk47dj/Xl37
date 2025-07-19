// bot.js
const { Telegraf } = require('telegraf');

// Ganti dengan token kamu
const bot = new Telegraf('7876140054:AAHCKPQhL2ptHbiAKCKK_HuBSUFgBfDd96I');

bot.start((ctx) => {
  ctx.reply('Halo! Aku adalah bot Telegram kamu 👋');
});

bot.on('text', (ctx) => {
  ctx.reply(`Kamu bilang: "${ctx.message.text}"`);
});

bot.launch();

console.log('🤖 Bot sedang berjalan...');
