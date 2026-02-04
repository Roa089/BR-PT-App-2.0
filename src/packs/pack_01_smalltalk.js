// src/packs/pack_01_smalltalk.js
export const packSmalltalk = {
  key: "smalltalk",
  name: "Smalltalk",
  enabledByDefault: true,

  BANK: {
    greetings: ["Oi", "Olá", "Bom dia", "Boa tarde", "Boa noite"],
    feelings: ["bem", "cansado", "animado", "tranquilo", "ocupado"],
    topics: ["hoje", "esta semana", "ultimamente", "agora", "nestes dias"],
    verbs: ["estou", "me sinto", "fico", "ando"],
    questions: ["como você está", "tudo bem", "como vai a vida", "como foi seu dia"]
  },

  TEMPLATES: [
    // A1
    { topic: "smalltalk", cefr: "A1", skill: "statement", pt: () => `Olá, tudo bem?`, deHint: "Hallo, alles gut?", forms: ["Oi, tudo bem?"], tags: ["greeting"] },
    { topic: "smalltalk", cefr: "A1", skill: "statement", pt: () => `Eu estou bem.`, deHint: "Mir geht es gut.", forms: ["Tô bem."], tags: ["feeling"] },

    // A2
    { topic: "smalltalk", cefr: "A2", skill: "question", pt: () => `Como você está hoje?`, deHint: "Wie geht es dir heute?", forms: ["E você, como está?"], tags: ["question"] },
    { topic: "smalltalk", cefr: "A2", skill: "statement", pt: () => `Hoje estou um pouco cansado.`, deHint: "Heute bin ich etwas müde.", forms: ["Hoje estou cansado demais."], tags: ["feeling"] },

    // B1
    { topic: "smalltalk", cefr: "B1", skill: "statement", pt: () => `Ultimamente tenho trabalhado muito.`, deHint: "In letzter Zeit arbeite ich viel.", forms: ["Tenho trabalhado bastante."], tags: ["routine"] },
    { topic: "smalltalk", cefr: "B1", skill: "question", pt: () => `O que você tem feito estes dias?`, deHint: "Was hast du in letzter Zeit gemacht?", forms: ["O que anda fazendo?"], tags: ["question"] },

    // B2
    { topic: "smalltalk", cefr: "B2", skill: "statement", pt: () => `Apesar do cansaço, estou satisfeito com meu progresso.`, deHint: "Trotz der Müdigkeit bin ich mit meinem Fortschritt zufrieden.", forms: ["Mesmo cansado, estou satisfeito."], tags: ["opinion"] },
    { topic: "smalltalk", cefr: "B2", skill: "question", pt: () => `Você costuma refletir sobre como foi sua semana?`, deHint: "Reflektierst du oft über deine Woche?", forms: ["Você pensa sobre sua semana?"], tags: ["reflection"] },

    // C1
    { topic: "smalltalk", cefr: "C1", skill: "statement", pt: () => `Nos últimos tempos, tenho tentado manter uma atitude mais positiva.`, deHint: "In letzter Zeit versuche ich, positiver zu bleiben.", forms: ["Tenho buscado ser mais positivo."], tags: ["attitude"] },
    { topic: "smalltalk", cefr: "C1", skill: "question", pt: () => `De que forma você lida com o estresse do dia a dia?`, deHint: "Wie gehst du mit Alltagsstress um?", forms: ["Como você enfrenta o estresse?"], tags: ["stress"] },

    // C2
    { topic: "smalltalk", cefr: "C2", skill: "statement", pt: () => `A conversa informal muitas vezes revela mais sobre as pessoas do que diálogos profundos.`, deHint: "Smalltalk verrät oft mehr über Menschen als tiefe Gespräche.", forms: ["O trivial também revela muito."], tags: ["abstract"] },
    { topic: "smalltalk", cefr: "C2", skill: "question", pt: () => `Você acredita que o small talk influencia a forma como construímos relações?`, deHint: "Glaubst du, dass Smalltalk Beziehungen beeinflusst?", forms: ["Smalltalk molda relações?"], tags: ["opinion"] }
  ]
};
