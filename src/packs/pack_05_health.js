// src/packs/pack_05_health.js
export const packHealth = {
  key: "health",
  name: "Health",
  enabledByDefault: true,

  BANK: {
    body: ["cabeça", "estômago", "braço", "costas"],
    habits: ["dormir", "exercitar", "descansar", "comer bem"]
  },

  TEMPLATES: [
    { topic: "health", cefr: "A1", skill: "statement", pt: () => `Eu estou doente.`, deHint: "Ich bin krank.", forms: ["Estou mal."], tags: ["sick"] },
    { topic: "health", cefr: "A1", skill: "question", pt: () => `Você está bem?`, deHint: "Geht es dir gut?", forms: ["Está bem?"], tags: ["check"] },

    { topic: "health", cefr: "A2", skill: "statement", pt: () => `Preciso descansar hoje.`, deHint: "Ich muss mich heute ausruhen.", forms: ["Vou descansar."], tags: ["rest"] },
    { topic: "health", cefr: "A2", skill: "question", pt: () => `Onde dói?`, deHint: "Wo tut es weh?", forms: ["O que dói?"], tags: ["pain"] },

    { topic: "health", cefr: "B1", skill: "statement", pt: () => `Tenho tentado dormir melhor durante a semana.`, deHint: "Ich versuche unter der Woche besser zu schlafen.", forms: ["Estou tentando dormir melhor."], tags: ["habit"] },
    { topic: "health", cefr: "B1", skill: "question", pt: () => `Você pratica algum esporte regularmente?`, deHint: "Machst du regelmäßig Sport?", forms: ["Você faz esporte?"], tags: ["exercise"] },

    { topic: "health", cefr: "B2", skill: "statement", pt: () => `A saúde mental é tão importante quanto a física.`, deHint: "Mentale Gesundheit ist so wichtig wie körperliche.", forms: ["Mente e corpo são importantes."], tags: ["mental"] },
    { topic: "health", cefr: "B2", skill: "question", pt: () => `O que você faz para reduzir o estresse?`, deHint: "Was tust du, um Stress zu reduzieren?", forms: ["Como você reduz o estresse?"], tags: ["stress"] },

    { topic: "health", cefr: "C1", skill: "statement", pt: () => `Estilos de vida saudáveis previnem diversas doenças.`, deHint: "Gesunde Lebensweise verhindert viele Krankheiten.", forms: ["Vida saudável previne doenças."], tags: ["prevention"] },
    { topic: "health", cefr: "C1", skill: "question", pt: () => `De que forma seus hábitos afetam sua qualidade de vida?`, deHint: "Wie beeinflussen deine Gewohnheiten deine Lebensqualität?", forms: ["Hábitos mudam sua vida?"], tags: ["quality"] },

    { topic: "health", cefr: "C2", skill: "statement", pt: () => `A percepção de bem-estar varia conforme fatores sociais e culturais.`, deHint: "Wohlbefinden hängt von sozialen und kulturellen Faktoren ab.", forms: ["Bem-estar depende da sociedade."], tags: ["abstract"] },
    { topic: "health", cefr: "C2", skill: "question", pt: () => `Você considera a saúde um valor individual ou coletivo?`, deHint: "Ist Gesundheit ein individueller oder kollektiver Wert?", forms: ["Saúde é individual ou coletiva?"], tags: ["philosophy"] }
  ]
};