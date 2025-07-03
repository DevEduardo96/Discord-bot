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
    GatewayIntentBits.MessageContent,
  ],
});

// IDs reais do seu servidor (substitua pelos corretos)
const CANAL_BOAS_VINDAS = "1390150562170929215";
const CANAL_REGRAS = "1390065847632138282";
const CANAL_LOJA = "1390065847896248446";

client.on("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.on("guildMemberAdd", async (member) => {
  const canal = member.guild.channels.cache.get(CANAL_BOAS_VINDAS);
  if (!canal) return;

  const embed = new EmbedBuilder()
    .setTitle("🥳 Bem-vindo(a) ao PortalStore!")
    .setDescription(
      `👤 Olá, <@${member.id}>!\n\n` +
        `📜 Leia as regras em <#${CANAL_REGRAS}>\n` +
        `✅ Verifique-se para acessar os canais\n` +
        `🛍️ Confira os produtos no canal <#${CANAL_LOJA}>\n\n` +
        `Se precisar de ajuda, chame um staff 👨‍💻`
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setColor(0x8a2be2)
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
