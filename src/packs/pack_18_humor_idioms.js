// src/packs/pack_18_humor_idioms.js
export const packHumorIdioms = {
  key: "humor_idioms",
  name: "Humor & Idioms",
  enabledByDefault: false,

  BANK: {
    idioms: [
      { pt: "ficar de boa", de: "locker bleiben" },
      { pt: "pagar mico", de: "sich blamieren" },
      { pt: "quebrar o galho", de: "aushelfen" },
      { pt: "dar um jeitinho", de: "einen Weg finden" }
    ],
    reactions: ["sério?", "não acredito!", "tá brincando!", "boa!", "eita!"]
  },

  TEMPLATES: [
    { topic: "humor", cefr: "A1", skill: "statement", pt: () => `Tá brincando!`, deHint: "Du machst Witze!", forms: ["Você tá brincando?"], tags: ["reaction"] },
    { topic: "humor", cefr: "A1", skill: "statement", pt: () => `Boa!`, deHint: "Nice!/Gut!", forms: ["Boa essa!"], tags: ["reaction"] },

    { topic: "humor", cefr: "A2", skill: "statement", pt: () => `Hoje eu paguei mico.`, deHint: "Heute habe ich mich blamiert.", forms: ["Passei vergonha hoje."], tags: ["idiom"] },
    { topic: "humor", cefr: "A2", skill: "question", pt: () => `Você entendeu a piada?`, deHint: "Hast du den Witz verstanden?", forms: ["Pegou a piada?"], tags: ["humor","question"] },

    { topic: "humor", cefr: "B1", skill: "statement", pt: () => `Ele quebrou o galho quando eu estava sem tempo.`, deHint: "Er half aus, als ich keine Zeit hatte.", forms: ["Ele me ajudou quando eu tava sem tempo."], tags: ["idiom","help"] },
    { topic: "humor", cefr: "B1", skill: "question", pt: () => `Qual expressão você mais usa no dia a dia?`, deHint: "Welche Redewendung nutzt du am meisten?", forms: ["Que expressão você usa mais?"], tags: ["language"] },

    { topic: "humor", cefr: "B2", skill: "statement", pt: () => `Eu gosto de humor leve, mas não curto piadas ofensivas.`, deHint: "Ich mag leichten Humor, aber keine beleidigenden Witze.", forms: ["Gosto de humor leve; não de ofensa."], tags: ["opinion"] },
    { topic: "humor", cefr: "B2", skill: "question", pt: () => `Você acha que sarcasmo funciona bem em português?`, deHint: "Funktioniert Sarkasmus gut auf Portugiesisch?", forms: ["Sarcástico em PT funciona?"], tags: ["language","opinion"] },

    { topic: "humor", cefr: "C1", skill: "statement", pt: () => `Expressões idiomáticas dão cor, mas podem confundir quem aprende.`, deHint: "Redewendungen färben Sprache, können aber Lernende verwirren.", forms: ["Idiomas dão cor e confundem."], tags: ["learning"] },
    { topic: "humor", cefr: "C1", skill: "question", pt: () => `Como você percebe quando uma piada passa do limite?`, deHint: "Woran merkst du, wenn ein Witz zu weit geht?", forms: ["Quando a piada vira ofensa?"], tags: ["ethics"] },

    { topic: "humor", cefr: "C2", skill: "statement", pt: () => `Humor é uma forma sofisticada de negociar tensão social sem confronto direto.`, deHint: "Humor verhandelt soziale Spannung ohne direkten Konflikt.", forms: ["Humor negocia tensão social."], tags: ["abstract"] },
    { topic: "humor", cefr: "C2", skill: "question", pt: () => `Você diria que rir junto cria pertencimento mais rápido do que concordar?`, deHint: "Schafft gemeinsames Lachen schneller Zugehörigkeit als Zustimmung?", forms: ["Rir junto cria pertencimento?"], tags: ["debate"] }
  ]
};