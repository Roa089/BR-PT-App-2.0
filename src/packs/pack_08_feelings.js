// src/packs/pack_08_feelings.js
export const packFeelings = {
  key: "feelings",
  name: "Feelings",
  enabledByDefault: true,

  BANK: {
    feelings: ["feliz", "triste", "ansioso", "calmo", "irritado", "orgulhoso"],
    reasons: ["por causa do trabalho", "por causa do trânsito", "porque dormi mal", "porque deu certo", "porque estou com saudade"],
    verbs: ["me sinto", "estou", "fico", "ando"]
  },

  TEMPLATES: [
    { topic: "feelings", cefr: "A1", skill: "statement", pt: () => `Eu estou feliz.`, deHint: "Ich bin glücklich.", forms: ["Tô feliz."], tags: ["emotion"] },
    { topic: "feelings", cefr: "A1", skill: "question", pt: () => `Você está triste?`, deHint: "Bist du traurig?", forms: ["Tá triste?"], tags: ["emotion","question"] },

    { topic: "feelings", cefr: "A2", skill: "statement", pt: () => `Hoje eu me sinto calmo.`, deHint: "Heute fühle ich mich ruhig.", forms: ["Hoje estou tranquilo."], tags: ["emotion","today"] },
    { topic: "feelings", cefr: "A2", skill: "question", pt: () => `O que te deixa irritado?`, deHint: "Was macht dich gereizt?", forms: ["O que te irrita?"], tags: ["emotion","cause"] },

    { topic: "feelings", cefr: "B1", skill: "statement", pt: () => `Fiquei ansioso porque dormi mal ontem.`, deHint: "Ich wurde nervös, weil ich gestern schlecht geschlafen habe.", forms: ["Estou ansioso por ter dormido mal."], tags: ["emotion","reason"] },
    { topic: "feelings", cefr: "B1", skill: "question", pt: () => `Quando você se sente mais motivado?`, deHint: "Wann fühlst du dich am motiviertesten?", forms: ["O que te motiva?"], tags: ["motivation"] },

    { topic: "feelings", cefr: "B2", skill: "statement", pt: () => `Mesmo com medo, decidi tentar de novo.`, deHint: "Trotz Angst habe ich beschlossen, es wieder zu versuchen.", forms: ["Apesar do medo, tentei de novo."], tags: ["courage"] },
    { topic: "feelings", cefr: "B2", skill: "question", pt: () => `Você costuma esconder o que sente em público?`, deHint: "Versteckst du oft deine Gefühle in der Öffentlichkeit?", forms: ["Você esconde seus sentimentos?"], tags: ["social"] },

    { topic: "feelings", cefr: "C1", skill: "statement", pt: () => `Percebi que minhas emoções mudam conforme meu nível de energia.`, deHint: "Ich merkte, dass meine Emotionen von meinem Energielevel abhängen.", forms: ["Minhas emoções variam com minha energia."], tags: ["self-awareness"] },
    { topic: "feelings", cefr: "C1", skill: "question", pt: () => `Como você diferencia ansiedade de entusiasmo?`, deHint: "Wie unterscheidest du Angst von Begeisterung?", forms: ["Ansiedade ou entusiasmo?"], tags: ["reflection"] },

    { topic: "feelings", cefr: "C2", skill: "statement", pt: () => `A linguagem emocional não descreve apenas estados internos; ela molda relações.`, deHint: "Emotionale Sprache beschreibt nicht nur innere Zustände, sie formt Beziehungen.", forms: ["Emoções moldam relações pela linguagem."], tags: ["abstract"] },
    { topic: "feelings", cefr: "C2", skill: "question", pt: () => `Você diria que a cultura define o que é “expressar” sentimentos?`, deHint: "Definiert Kultur, was Gefühlsausdruck ist?", forms: ["Cultura define expressão emocional?"], tags: ["culture","debate"] }
  ]
};