const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("로아 캐릭터 인증하기"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
