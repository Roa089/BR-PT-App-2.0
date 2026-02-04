// src/packs/pack_04_work.js
export const packWork = {
  key: "work",
  name: "Work",
  enabledByDefault: true,

  BANK: {
    jobs: ["emprego", "trabalho", "projeto", "reunião", "empresa"],
    verbs: ["trabalhar", "estudar", "organizar", "planejar", "decidir"]
  },

  TEMPLATES: [
    { topic: "work", cefr: "A1", skill: "statement", pt: () => `Eu trabalho em um escritório.`, deHint: "Ich arbeite in einem Büro.", forms: ["Trabalho num escritório."], tags: ["job"] },
    { topic: "work", cefr: "A1", skill: "question", pt: () => `Você trabalha hoje?`, deHint: "Arbeitest du heute?", forms: ["Você trabalha hoje?"], tags: ["routine"] },

    { topic: "work", cefr: "A2", skill: "statement", pt: () => `Tenho uma reunião à tarde.`, deHint: "Ich habe am Nachmittag ein Meeting.", forms: ["Vou ter reunião."], tags: ["meeting"] },
    { topic: "work", cefr: "A2", skill: "question", pt: () => `Qual é o seu trabalho?`, deHint: "Was ist dein Beruf?", forms: ["O que você faz?"], tags: ["job"] },

    { topic: "work", cefr: "B1", skill: "statement", pt: () => `Estou envolvido em um novo projeto.`, deHint: "Ich bin in ein neues Projekt eingebunden.", forms: ["Participo de um projeto novo."], tags: ["project"] },
    { topic: "work", cefr: "B1", skill: "question", pt: () => `Você gosta do seu ambiente de trabalho?`, deHint: "Magst du dein Arbeitsumfeld?", forms: ["Gosta do trabalho?"], tags: ["opinion"] },

    { topic: "work", cefr: "B2", skill: "statement", pt: () => `Equilíbrio entre vida pessoal e profissional é essencial.`, deHint: "Work-Life-Balance ist wichtig.", forms: ["Equilíbrio é importante."], tags: ["balance"] },
    { topic: "work", cefr: "B2", skill: "question", pt: () => `Quais são seus objetivos profissionais?`, deHint: "Was sind deine beruflichen Ziele?", forms: ["Quais seus objetivos?"], tags: ["goals"] },

    { topic: "work", cefr: "C1", skill: "statement", pt: () => `A satisfação no trabalho depende de múltiplos fatores.`, deHint: "Arbeitszufriedenheit hängt von vielen Faktoren ab.", forms: ["Trabalho bom depende de fatores."], tags: ["analysis"] },
    { topic: "work", cefr: "C1", skill: "question", pt: () => `De que forma o trabalho influencia sua identidade pessoal?`, deHint: "Wie beeinflusst Arbeit deine Identität?", forms: ["Trabalho muda quem você é?"], tags: ["identity"] },

    { topic: "work", cefr: "C2", skill: "statement", pt: () => `O conceito de carreira vem se transformando nas sociedades modernas.`, deHint: "Das Karrierekonzept verändert sich in modernen Gesellschaften.", forms: ["A carreira está mudando."], tags: ["society"] },
    { topic: "work", cefr: "C2", skill: "question", pt: () => `Você acredita que o trabalho define o valor de uma pessoa?`, deHint: "Definiert Arbeit den Wert eines Menschen?", forms: ["Trabalho define valor?"], tags: ["philosophy"] }
  ]
};