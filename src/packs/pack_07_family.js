// src/packs/pack_07_family.js
export const packFamily = {
  key: "family",
  name: "Family",
  enabledByDefault: true,

  BANK: {
    members: ["mãe", "pai", "irmão", "irmã", "filho", "filha", "avó", "avô"],
    verbs: ["morar", "visitar", "ajudar", "ligar", "cuidar"],
    moments: ["no fim de semana", "hoje", "amanhã", "às vezes", "todo mês"]
  },

  TEMPLATES: [
    { topic: "family", cefr: "A1", skill: "statement", pt: () => `Eu tenho uma irmã.`, deHint: "Ich habe eine Schwester.", forms: ["Tenho uma irmã."], tags: ["family"] },
    { topic: "family", cefr: "A1", skill: "question", pt: () => `Sua mãe está em casa?`, deHint: "Ist deine Mutter zu Hause?", forms: ["A sua mãe está em casa?"], tags: ["family","home"] },

    { topic: "family", cefr: "A2", skill: "statement", pt: () => `Eu moro com minha família.`, deHint: "Ich wohne mit meiner Familie.", forms: ["Moro com a família."], tags: ["living"] },
    { topic: "family", cefr: "A2", skill: "question", pt: () => `Quantos irmãos você tem?`, deHint: "Wie viele Geschwister hast du?", forms: ["Você tem irmãos?"], tags: ["family","question"] },

    { topic: "family", cefr: "B1", skill: "statement", pt: () => `No fim de semana, vou visitar meus pais.`, deHint: "Am Wochenende besuche ich meine Eltern.", forms: ["Vou ver meus pais no fim de semana."], tags: ["plans"] },
    { topic: "family", cefr: "B1", skill: "question", pt: () => `Como é a relação da sua família?`, deHint: "Wie ist das Verhältnis in deiner Familie?", forms: ["Como vocês se dão?"], tags: ["relationships"] },

    { topic: "family", cefr: "B2", skill: "statement", pt: () => `Minha família me apoiou quando eu mudei de cidade.`, deHint: "Meine Familie unterstützte mich, als ich umzog.", forms: ["Eles me deram muito apoio."], tags: ["support"] },
    { topic: "family", cefr: "B2", skill: "question", pt: () => `Você acha importante manter tradições familiares?`, deHint: "Findest du Familientraditionen wichtig?", forms: ["Tradições são importantes?"], tags: ["tradition","opinion"] },

    { topic: "family", cefr: "C1", skill: "statement", pt: () => `Com o tempo, aprendi a respeitar diferentes formas de viver em família.`, deHint: "Mit der Zeit lernte ich, verschiedene Familienmodelle zu respektieren.", forms: ["Aprendi a respeitar outros modelos familiares."], tags: ["perspective"] },
    { topic: "family", cefr: "C1", skill: "question", pt: () => `De que maneira a família influencia nossas escolhas profissionais?`, deHint: "Wie beeinflusst Familie unsere beruflichen Entscheidungen?", forms: ["Família afeta carreira?"], tags: ["influence"] },

    { topic: "family", cefr: "C2", skill: "statement", pt: () => `Laços familiares podem ser tanto fonte de estabilidade quanto de conflito silencioso.`, deHint: "Familienbande können Stabilität oder stillen Konflikt bedeuten.", forms: ["Família pode estabilizar ou pesar."], tags: ["abstract"] },
    { topic: "family", cefr: "C2", skill: "question", pt: () => `Até que ponto a obrigação familiar limita a autonomia individual?`, deHint: "Inwiefern begrenzen Familienpflichten die Autonomie?", forms: ["Obrigação limita autonomia?"], tags: ["ethics","debate"] }
  ]
};