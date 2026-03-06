import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const categories = [
  { name: "Reazioni", slug: "reazioni", iconEmoji: "😤", color: "#ef4444", description: "Meme di reazione a situazioni comuni" },
  { name: "Classici", slug: "classici", iconEmoji: "🏛️", color: "#f59e0b", description: "I template meme senza tempo" },
  { name: "Italia", slug: "italia", iconEmoji: "🇮🇹", color: "#22c55e", description: "Meme tipicamente italiani" },
  { name: "Gaming", slug: "gaming", iconEmoji: "🎮", color: "#8b5cf6", description: "Template dal mondo del gaming" },
  { name: "Animali", slug: "animali", iconEmoji: "🐾", color: "#f97316", description: "Meme con protagonisti animali" },
  { name: "Serie TV", slug: "serie-tv", iconEmoji: "📺", color: "#3b82f6", description: "Template da serie TV e film" },
  { name: "Politica", slug: "politica", iconEmoji: "🏛", color: "#6366f1", description: "Satira politica e sociale" },
  { name: "Sport", slug: "sport", iconEmoji: "⚽", color: "#10b981", description: "Template dal mondo dello sport" },
  { name: "Situazioni", slug: "situazioni", iconEmoji: "🤦", color: "#ec4899", description: "Situazioni quotidiane universali" },
  { name: "Seasonal", slug: "seasonal", iconEmoji: "🎄", color: "#14b8a6", description: "Meme stagionali e per le feste" },
];

const memeBases = [
  {
    title: "Drake Approva / Non Approva",
    slug: "drake-approva-non-approva",
    description: "Il classico meme di Drake che indica cosa gli piace e cosa no. Perfetto per confronti e preferenze.",
    fileUrl: "https://i.imgflip.com/30b1gx.jpg",
    fileType: "IMAGE", width: 1200, height: 1200,
    categorySlug: "classici",
    tags: ["drake", "approva", "scelta", "confronto", "classico"],
  },
  {
    title: "Fidanzato Distratto",
    slug: "fidanzato-distratto",
    description: "Il ragazzo che guarda un'altra persona mentre la sua fidanzata lo fissa male. Usato per mostrare preferenze improvvise.",
    fileUrl: "https://i.imgflip.com/1ur9b0.jpg",
    fileType: "IMAGE", width: 1200, height: 800,
    categorySlug: "classici",
    tags: ["fidanzato", "distratto", "tradimento", "scelta", "relazione"],
  },
  {
    title: "Woman Yelling at Cat",
    slug: "woman-yelling-at-cat",
    description: "La donna che urla e il gatto bianco seduto al tavolo. Uno dei template più versatili per contrasti comici.",
    fileUrl: "https://i.imgflip.com/345v97.jpg",
    fileType: "IMAGE", width: 1200, height: 600,
    categorySlug: "reazioni",
    tags: ["gatto", "donna", "urla", "smudge", "reazione"],
  },
  {
    title: "Due Pulsanti",
    slug: "due-pulsanti",
    description: "Il tizio che suda di fronte a due pulsanti. Template perfetto per dilemmi impossibili.",
    fileUrl: "https://i.imgflip.com/1g8my4.jpg",
    fileType: "IMAGE", width: 600, height: 908,
    categorySlug: "situazioni",
    tags: ["pulsanti", "dilemma", "scelta", "sudore", "difficile"],
  },
  {
    title: "Surprised Pikachu",
    slug: "surprised-pikachu",
    description: "Pikachu con la faccia sorpresa e la bocca aperta. Per reazioni a eventi ovvi e prevedibili.",
    fileUrl: "https://i.imgflip.com/2kbn1e.jpg",
    fileType: "IMAGE", width: 1893, height: 1893,
    categorySlug: "reazioni",
    tags: ["pikachu", "sorpresa", "pokemon", "shock", "reazione"],
  },
  {
    title: "This Is Fine",
    slug: "this-is-fine",
    description: "Il cagnolino che beve caffè mentre tutto brucia intorno a lui. Icona del negare i problemi.",
    fileUrl: "https://i.imgflip.com/wxica.jpg",
    fileType: "IMAGE", width: 580, height: 282,
    categorySlug: "reazioni",
    tags: ["cane", "fuoco", "fine", "caos", "negazione"],
  },
  {
    title: "Piano di Gru",
    slug: "piano-di-gru",
    description: "Il piano a 4 pannelli di Gru da Cattivissimo Me, dove il terzo step vanifica tutto. Template narrativo perfetto.",
    fileUrl: "https://i.imgflip.com/26am.jpg",
    fileType: "IMAGE", width: 500, height: 507,
    categorySlug: "classici",
    tags: ["gru", "piano", "cattivissimo-me", "schema", "fail"],
  },
  {
    title: "Roll Safe",
    slug: "roll-safe",
    description: "Il tipo che si tocca la tempia con aria furba. Per soluzioni stupide presentate come geniali.",
    fileUrl: "https://i.imgflip.com/1h7in3.jpg",
    fileType: "IMAGE", width: 702, height: 395,
    categorySlug: "reazioni",
    tags: ["furbo", "tempia", "intelligente", "trucco", "logica"],
  },
  {
    title: "Mocking Spongebob",
    slug: "mocking-spongebob",
    description: "Spongebob che imita qualcuno in modo sarcastico. Template per prendere in giro affermazioni altrui.",
    fileUrl: "https://i.imgflip.com/1otk96.jpg",
    fileType: "IMAGE", width: 502, height: 353,
    categorySlug: "reazioni",
    tags: ["spongebob", "imitazione", "sarcasmo", "ironia"],
  },
  {
    title: "Change My Mind",
    slug: "change-my-mind",
    description: "Steven Crowder al tavolo con il cartello 'Change My Mind'. Per affermazioni provocatorie.",
    fileUrl: "https://i.imgflip.com/24y43o.jpg",
    fileType: "IMAGE", width: 960, height: 720,
    categorySlug: "situazioni",
    tags: ["opinione", "dibattito", "provocazione"],
  },
  {
    title: "Stonks",
    slug: "stonks",
    description: "Il Meme Man davanti al grafico in salita. Per situazioni dove si guadagna in modi assurdi.",
    fileUrl: "https://i.imgflip.com/3e4mck.jpg",
    fileType: "IMAGE", width: 600, height: 486,
    categorySlug: "situazioni",
    tags: ["stonks", "borsa", "guadagno", "economia"],
  },
  {
    title: "Left Exit 12 Off Ramp",
    slug: "left-exit-12-off-ramp",
    description: "La macchina che prende l'uscita sbagliata all'ultimo momento. Per scelte improvvise e deviazioni.",
    fileUrl: "https://i.imgflip.com/22bdq6.jpg",
    fileType: "IMAGE", width: 790, height: 532,
    categorySlug: "situazioni",
    tags: ["macchina", "uscita", "deviazione", "scelta"],
  },
  {
    title: "Uno Draw 25 Cards",
    slug: "uno-draw-25-cards",
    description: "Il personaggio di UNO davanti al mazzo di carte. Per situazioni in cui si evita qualcosa a tutti i costi.",
    fileUrl: "https://i.imgflip.com/3lmzyx.jpg",
    fileType: "IMAGE", width: 500, height: 500,
    categorySlug: "reazioni",
    tags: ["uno", "carte", "evitare", "rifiuto"],
  },
  {
    title: "Trade Offer",
    slug: "trade-offer",
    description: "Il tiktoker con l'offerta di scambio. Perfetto per proposte squilibrate o vantaggiose solo per una parte.",
    fileUrl: "https://i.imgflip.com/5c7lwq.png",
    fileType: "IMAGE", width: 1080, height: 1920,
    categorySlug: "situazioni",
    tags: ["trade", "offerta", "scambio", "accordo"],
  },
  {
    title: "Always Has Been",
    slug: "always-has-been",
    description: "I due astronauti sulla luna con la pistola. Per rivelare verità ovvie che tutti ignoravano.",
    fileUrl: "https://i.imgflip.com/46e43q.png",
    fileType: "IMAGE", width: 1080, height: 1080,
    categorySlug: "classici",
    tags: ["astronauti", "luna", "pistola", "verita"],
  },
  {
    title: "Galaxy Brain",
    slug: "galaxy-brain",
    description: "Il cervello che si espande in 4 fasi sempre più galattiche. Per ragionamenti sempre più assurdi.",
    fileUrl: "https://i.imgflip.com/2dnzmd.jpg",
    fileType: "IMAGE", width: 1440, height: 1561,
    categorySlug: "classici",
    tags: ["cervello", "galaxy", "espansione", "intelligenza"],
  },
  {
    title: "Batman Schiaffeggia Robin",
    slug: "batman-schiaffeggia-robin",
    description: "Batman che schiaffeggia Robin mentre dice qualcosa. Template classico per zittire ragionamenti stupidi.",
    fileUrl: "https://i.imgflip.com/9ehk.jpg",
    fileType: "IMAGE", width: 600, height: 450,
    categorySlug: "classici",
    tags: ["batman", "robin", "schiaffo", "supereroi"],
  },
  {
    title: "Bernie Sanders Seduto",
    slug: "bernie-sanders-seduto",
    description: "Bernie Sanders seduto con i guanti e le muffole all'inaugurazione. Template universale per inserire Bernie ovunque.",
    fileUrl: "https://i.imgflip.com/4t0m5.jpg",
    fileType: "IMAGE", width: 640, height: 636,
    categorySlug: "politica",
    tags: ["bernie", "sanders", "guanti", "inaugurazione"],
  },
  {
    title: "Gatto Schifato sul Tavolo",
    slug: "gatto-schifato-sul-tavolo",
    description: "Il famoso Smudge Lord, il gatto bianco seduto al tavolo con aria di disgusto. Versione singola.",
    fileUrl: "https://i.imgflip.com/7w8ne8.jpg",
    fileType: "IMAGE", width: 700, height: 700,
    categorySlug: "animali",
    tags: ["gatto", "smudge", "disgusto", "tavolo"],
  },
  {
    title: "Panik / Kalm",
    slug: "panik-kalm",
    description: "I tre pannelli con panik-kalm-panik. Per situazioni che peggiorano quando sembra tutto risolto.",
    fileUrl: "https://i.imgflip.com/3qqmuh.jpg",
    fileType: "IMAGE", width: 498, height: 498,
    categorySlug: "reazioni",
    tags: ["panik", "kalm", "panico", "calma"],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  for (let i = 0; i < categories.length; i++) {
    await db.category.upsert({
      where: { slug: categories[i].slug },
      update: {},
      create: { ...categories[i], order: i },
    });
  }
  console.log(`✅ ${categories.length} categorie create`);

  // Admin user
  const adminPassword = await bcrypt.hash("admin123!", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@basimeme.it" },
    update: {},
    create: {
      email: "admin@basimeme.it",
      username: "admin",
      name: "Admin BasiMeme",
      password: adminPassword,
      role: "ADMIN",
      bio: "Amministratore di BasiMeme.it — powered by Memefattori",
    },
  });

  // Demo user
  const demoPassword = await bcrypt.hash("demo1234", 12);
  const demo = await db.user.upsert({
    where: { email: "memefattori@basimeme.it" },
    update: {},
    create: {
      email: "memefattori@basimeme.it",
      username: "memefattori",
      name: "Memefattori",
      password: demoPassword,
      role: "MODERATOR",
      bio: "Creator ufficiale di BasiMeme.it 🧃",
    },
  });
  console.log(`✅ Utenti creati`);

  // Reset contatori su basi esistenti (counters reali, non fake)
  await db.memeBase.updateMany({
    data: {
      upvotesCount: 0,
      downloadsCount: 0,
      viewsCount: 0,
      trendingScore: 0,
      isTrending: false,
    },
  });

  // Meme bases
  let created = 0;
  for (const meme of memeBases) {
    const existing = await db.memeBase.findUnique({ where: { slug: meme.slug } });
    if (existing) continue;

    const category = await db.category.findUnique({ where: { slug: meme.categorySlug } });

    const tagRecords = await Promise.all(
      meme.tags.map(async (tagName) => {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        return db.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName.toLowerCase(), slug: tagSlug },
        });
      })
    );

    const authorId = created % 3 === 0 ? demo.id : admin.id;

    await db.memeBase.create({
      data: {
        title: meme.title,
        slug: meme.slug,
        description: meme.description,
        fileUrl: meme.fileUrl,
        fileType: meme.fileType,
        width: meme.width,
        height: meme.height,
        status: "APPROVED",
        approvedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        upvotesCount: 0,
        downloadsCount: 0,
        viewsCount: 0,
        trendingScore: 0,
        isTrending: false,
        authorId,
        categoryId: category?.id ?? null,
        tags: { create: tagRecords.map((t) => ({ tagId: t.id })) },
      },
    });
    created++;
  }
  console.log(`✅ ${created} basi meme create (contatori a zero — reali)`);
  console.log("🎉 Seed completato!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
