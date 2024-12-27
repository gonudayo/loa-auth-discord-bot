const fs = require("node:fs");
const path = require("node:path");
const {
  ActionRowBuilder,
  Client,
  Events,
  GatewayIntentBits,
  InteractionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
  Collection,
} = require("discord.js");

// use dotenv
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

// 입장 인증
client.on(Events.GuildMemberAdd, async (member) => {
  await member.user.send("입장감지DM");
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

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
