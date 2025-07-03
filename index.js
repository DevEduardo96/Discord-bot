require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // <- ESSENCIAL!
  ],
});

const CANAL_BOAS_VINDAS = "id-do-canal-aqui"; // Altere para o ID do seu canal de boas-vindas

client.on("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  const canal = member.guild.channels.cache.get(CANAL_BOAS_VINDAS);
  if (!canal) return;

  const embed = new EmbedBuilder()
    .setTitle("👋 Bem-vindo ao servidor!")
    .setDescription(
      `👤 **Usuário:** <@${member.id}>\n🧑‍🤝‍🧑 **Membros atualmente:** ${member.guild.memberCount}`
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setColor(0x8a2be2) // Roxo
    .setFooter({ text: `ID: ${member.id}` });

  const botoes = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("🛍️ Compre Aqui")
      .setStyle(ButtonStyle.Link)
      .setURL("https://sualoja.com"),

    new ButtonBuilder()
      .setLabel("📜 Termos")
      .setStyle(ButtonStyle.Link)
      .setURL("https://sualoja.com/termos"),

    new ButtonBuilder()
      .setLabel("🆘 Suporte")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/seuservidor")
  );

  canal.send({ embeds: [embed], components: [botoes] });
});

client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    message.channel.send("Pong!");
  }
});

client.login(process.env.TOKEN);
