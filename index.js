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
} = require("discord.js");

// use dotenv
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;

  let button = new ActionRowBuilder();
  button.addComponents(
    new ButtonBuilder()
      .setCustomId("verification-button")
      .setStyle(ButtonStyle.Primary)
      .setLabel("인증 시작하기")
  );
  message.reply({
    components: [button],
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "verification-button") {
      // 첫 번째 모달 표시
      const modal = new ModalBuilder()
        .setCustomId("nickname-modal")
        .setTitle("닉네임 입력하기")
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("nickname-input")
              .setLabel("닉네임")
              .setStyle(TextInputStyle.Short)
              .setMinLength(2)
              .setMaxLength(20)
              .setPlaceholder("이곳에 닉네임을 입력해 주세요.")
              .setRequired(true)
          ),
        ]);

      await interaction.showModal(modal);
    }
  }

  if (interaction.type === InteractionType.ModalSubmit) {
    if (interaction.customId === "nickname-modal") {
      const response = interaction.fields.getTextInputValue("nickname-input");

      // 모달 제출 응답
      await interaction.reply({
        content: `제출한 닉네임: "${response}"`,
        ephemeral: true, // 사용자에게만 보이도록 설정
      });

      console.log(response);

      // 두 번째 버튼 제공
      let secondButton = new ActionRowBuilder();
      secondButton.addComponents(
        new ButtonBuilder()
          .setCustomId("profile-selection-button")
          .setStyle(ButtonStyle.Primary)
          .setLabel("인증하기")
      );

      // 버튼을 사용자에게 응답으로 제공
      await interaction.followUp({
        components: [secondButton],
        ephemeral: true,
      });
    } else if (interaction.customId === "profile-modal") {
      const profileResponse =
        interaction.fields.getTextInputValue("profile-input");
      await interaction.reply({
        content: `제출되었습니다.`,
        ephemeral: true,
      });
      console.log(profileResponse);
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === "profile-selection-button") {
      // 두 번째 모달 표시
      const secondModal = new ModalBuilder()
        .setCustomId("profile-modal")
        .setTitle("스토브 라운지 프로필 인증하기")
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("profile-input")
              .setLabel("프로필 주소")
              .setStyle(TextInputStyle.Short)
              .setMinLength(3)
              .setMaxLength(20)
              .setPlaceholder("이곳에 프로필 주소를 입력해 주세요.")
              .setRequired(true)
          ),
        ]);

      await interaction.showModal(secondModal);
    }
  }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
