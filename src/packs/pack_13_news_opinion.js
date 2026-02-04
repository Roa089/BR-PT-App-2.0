// src/packs/pack_13_news_opinion.js
export const packNewsOpinion = {
  key: "news_opinion",
  name: "News & Opinion",
  enabledByDefault: false,

  BANK: {
    verbs: ["ler", "assistir", "acompanhar", "comentar", "discordar"],
    sources: ["notícias", "jornal", "podcast", "rede social", "telejornal"],
    stances: ["na minha opinião", "eu acho que", "do meu ponto de vista", "sinceramente"]
  },

  TEMPLATES: [
    { topic: "news_opinion", cefr: "A1", skill: "statement", pt: () => `Eu vi uma notícia hoje.`, deHint: "Ich habe heute eine Nachricht gesehen.", forms: ["Vi uma notícia hoje."], tags: ["news"] },
    { topic: "news_opinion", cefr: "A1", skill: "question", pt: () => `Você viu isso na TV?`, deHint: "Hast du das im Fernsehen gesehen?", forms: ["Você viu na TV?"], tags: ["news","question"] },

    { topic: "news_opinion", cefr: "A2", skill: "statement", pt: () => `Eu acompanho notícias pelo celular.`, deHint: "Ich verfolge Nachrichten am Handy.", forms: ["Eu sigo notícias no celular."], tags: ["habit"] },
    { topic: "news_opinion", cefr: "A2", skill: "question", pt: () => `O que você acha dessa notícia?`, deHint: "Was hältst du von dieser Nachricht?", forms: ["O que você acha disso?"], tags: ["opinion"] },

    { topic: "news_opinion", cefr: "B1", skill: "statement", pt: () => `Na minha opinião, a matéria exagerou um pouco.`, deHint: "Meiner Meinung nach hat der Bericht etwas übertrieben.", forms: ["A matéria exagerou, eu acho."], tags: ["opinion"] },
    { topic: "news_opinion", cefr: "B1", skill: "question", pt: () => `Você confia nas informações das redes sociais?`, deHint: "Vertraust du Infos aus sozialen Netzwerken?", forms: ["Você confia em redes sociais?"], tags: ["media"] },

    { topic: "news_opinion", cefr: "B2", skill: "statement", pt: () => `Eu tento checar a fonte antes de compartilhar qualquer coisa.`, deHint: "Ich prüfe die Quelle, bevor ich etwas teile.", forms: ["Checo a fonte antes de compartilhar."], tags: ["media","habits"] },
    { topic: "news_opinion", cefr: "B2", skill: "question", pt: () => `Que tipo de notícia mais te interessa: política, economia ou cultura?`, deHint: "Welche Nachrichten interessieren dich am meisten?", forms: ["O que te interessa mais nas notícias?"], tags: ["preferences"] },

    { topic: "news_opinion", cefr: "C1", skill: "statement", pt: () => `A forma como a notícia é narrada influencia nossa interpretação.`, deHint: "Die Erzählweise beeinflusst unsere Interpretation.", forms: ["A narrativa muda a interpretação."], tags: ["analysis"] },
    { topic: "news_opinion", cefr: "C1", skill: "question", pt: () => `Como você identifica viés em um texto jornalístico?`, deHint: "Wie erkennst du Bias in einem Artikel?", forms: ["Como perceber viés?"], tags: ["critical"] },

    { topic: "news_opinion", cefr: "C2", skill: "statement", pt: () => `O debate público se deteriora quando opinião substitui evidência.`, deHint: "Öffentliche Debatten leiden, wenn Meinung Evidenz ersetzt.", forms: ["Opinião sem evidência enfraquece o debate."], tags: ["abstract"] },
    { topic: "news_opinion", cefr: "C2", skill: "question", pt: () => `Você acha possível discutir sem polarizar em temas sensíveis?`, deHint: "Kann man heikle Themen ohne Polarisierung diskutieren?", forms: ["Dá pra discutir sem polarizar?"], tags: ["debate"] }
  ]
};