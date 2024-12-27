const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("로아 캐릭터 인증하기"),
  async execute(interaction) {
    let button = new ActionRowBuilder();

    button.addComponents(
      new ButtonBuilder()
        .setCustomId("verification-button")
        .setStyle(ButtonStyle.Primary)
        .setLabel("프로필 주소 제출하기")
    );

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("로스트아크 캐릭터 인증 방법")
      .setDescription("아래 방법을 따라해 주세요.")
      .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
        { name: "Inline field title", value: "Some value here", inline: true }
      )
      .addFields({
        name: "Inline field title",
        value: "Some value here",
        inline: true,
      })
      .setImage("https://i.imgur.com/AfFp7pu.png");

    await interaction.user.send({
      content: `welcome to the server, ${interaction.user.username}!`,
      components: [button],
      embeds: [exampleEmbed],
    });
  },
};
