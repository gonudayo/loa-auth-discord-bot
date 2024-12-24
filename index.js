const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Events,
  GatewayIntentBits,
  InteractionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");

// use dotenv
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on(Events.MessageCreate, async (interaction) => {
  if (interaction.author.bot) return;

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

  await interaction.reply({
    components: [button],
    embeds: [exampleEmbed],
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "verification-button") {
      // 첫 번째 모달 표시
      const modal = new ModalBuilder()
        .setCustomId("profile-modal")
        .setTitle("스토브 라운지 프로필 인증")
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("profile-input")
              .setLabel("프로필 주소")
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("이곳에 프로필 주소를 입력해 주세요.")
              .setRequired(true)
          ),
        ]);

      await interaction.showModal(modal);
    }
  }

  if (interaction.type === InteractionType.ModalSubmit) {
    if (interaction.customId === "profile-modal") {
      const response = interaction.fields.getTextInputValue("profile-input");

      console.log(response);

      const select = new StringSelectMenuBuilder()
        .setCustomId("starter")
        .setPlaceholder("Make a selection!")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Bulbasaur")
            .setDescription("The dual-type Grass/Poison Seed Pokémon.")
            .setValue("bulbasaur"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Charmander")
            .setDescription("The Fire-type Lizard Pokémon.")
            .setValue("charmander"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Squirtle")
            .setDescription("The Water-type Tiny Turtle Pokémon.")
            .setValue("squirtle")
        );

      const row = new ActionRowBuilder().addComponents(select);

      await interaction.reply({
        components: [row],
        ephemeral: true,
      });
    }
  }

  if (interaction.isSelectMenu()) {
    if (interaction.customId === "starter") {
      const selected = interaction.values[0];

      console.log(`선택한 항목: ${selected}`);

      await interaction.update({
        content: `선택한 항목: ${selected}`,
        components: [],
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
