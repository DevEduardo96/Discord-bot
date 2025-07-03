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

// Canal de boas-vindas (ajuste para seu canal real)
const CANAL_BOAS_VINDAS = "1390150562170929215";

// Proteção: evitar múltiplos registros
let jaRegistrouBoasVindas = false;

// Função para envio com retry (ex: erro 502)
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

client.once("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

// Usar once para evitar múltiplos listeners duplicados
if (!jaRegistrouBoasVindas) {
  jaRegistrouBoasVindas = true;

  client.on("guildMemberAdd", async (member) => {
    console.log(`➡️ Novo membro entrou: ${member.user.tag} (${member.id})`);

    const canal = member.guild.channels.cache.get(CANAL_BOAS_VINDAS);
    if (!canal || !canal.isTextBased()) {
      console.warn("❌ Canal de boas-vindas não encontrado ou inválido.");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Boas Vindas")
      .setColor(0x8a2be2)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `👤 **ID do usuário:** ${member.id}\n` +
          `👥 **Membros atualmente:** ${member.guild.memberCount} membros.`
      );

    const botoes = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("🛒 Compre Aqui")
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
}

// Comando !ping
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === "!ping") {
    try {
      await message.channel.send("🏓 Pong!");
    } catch (err) {
      console.error("❌ Erro ao responder !ping:", err);
    }
  }
});

client.login(process.env.TOKEN);
