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

// Função de envio com retry para erros como 502
async function sendWithRetry(channel, message, retries = 2) {
  try {
    await channel.send(message);
  } catch (err) {
    if (err.status === 502 && retries > 0) {
      console.warn("⚠️ Erro 502. Tentando novamente...");
      setTimeout(() => sendWithRetry(channel, message, retries - 1), 3000);
    } else {
      console.error("❌ Erro ao enviar mensagem:", err);
    }
  }
}

client.on("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
  console.log(`📡 Conectado a ${client.guilds.cache.size} servidores.`);
});

client.on("guildMemberAdd", async (member) => {
  const canal = member.guild.channels.cache.get(CANAL_BOAS_VINDAS);
  if (!canal || !canal.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setTitle("🥳 Bem-vindo(a) ao PortalStore!")
    .setDescription(
      `👤 Olá, <@${member.id}>!\n\n` +
        `📜 Leia as regras em <#${CANAL_REGRAS}>\n` +
        `✅ Verifique-se para acessar os canais\n` +
        `🛍️ Confira os produtos no canal <#${CANAL_LOJA}>\n\n` +
        `Se precisar de ajuda, chame um staff 👨‍💻`
    )
    .setThumbnail(
      member.user.displayAvatarURL({ dynamic: true }) || "https://via.placeholder.com/150"
    )
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

  await sendWithRetry(canal, { embeds: [embed], components: [botoes] });
});

client.on("messageCreate", async (message) => {
  if (message.content === "!ping") {
    try {
      await message.channel.send("Pong!");
    } catch (err) {
      console.error("❌ Erro ao responder !ping:", err);
    }
  }
});

client.login(process.env.TOKEN);

