// src/packs/pack_15_friends_dating.js
export const packFriendsDating = {
  key: "friends_dating",
  name: "Friends & Dating",
  enabledByDefault: true,

  BANK: {
    verbs: ["conhecer", "marcar", "sair", "conversar", "curtir"],
    places: ["café", "bar", "parque", "praia", "cinema"],
    vibe: ["amizade", "encontro", "boa energia", "conexão", "respeito"]
  },

  TEMPLATES: [
    { topic: "friends_dating", cefr: "A1", skill: "question", pt: () => `Vamos tomar um café?`, deHint: "Wollen wir einen Kaffee trinken?", forms: ["Bora tomar um café?"], tags: ["invite"] },
    { topic: "friends_dating", cefr: "A1", skill: "statement", pt: () => `Eu gosto de conversar com você.`, deHint: "Ich rede gern mit dir.", forms: ["Gosto de falar com você."], tags: ["connection"] },

    { topic: "friends_dating", cefr: "A2", skill: "statement", pt: () => `Podemos marcar um encontro no parque.`, deHint: "Wir können ein Treffen im Park ausmachen.", forms: ["Vamos marcar no parque."], tags: ["plan"] },
    { topic: "friends_dating", cefr: "A2", skill: "question", pt: () => `Você quer sair hoje à noite?`, deHint: "Willst du heute Abend ausgehen?", forms: ["Quer sair hoje?"], tags: ["invite"] },

    { topic: "friends_dating", cefr: "B1", skill: "statement", pt: () => `Eu prefiro encontros tranquilos, sem muita barulheira.`, deHint: "Ich bevorzuge ruhige Treffen ohne viel Lärm.", forms: ["Gosto de lugares tranquilos."], tags: ["preference"] },
    { topic: "friends_dating", cefr: "B1", skill: "question", pt: () => `O que você gosta de fazer no fim de semana?`, deHint: "Was machst du gern am Wochenende?", forms: ["O que você curte no fim de semana?"], tags: ["interests"] },

    { topic: "friends_dating", cefr: "B2", skill: "statement", pt: () => `Para mim, respeito e sinceridade são essenciais em qualquer relação.`, deHint: "Für mich sind Respekt und Ehrlichkeit essenziell.", forms: ["Respeito e sinceridade são essenciais."], tags: ["values"] },
    { topic: "friends_dating", cefr: "B2", skill: "question", pt: () => `Você acha que química aparece logo no começo?`, deHint: "Entsteht Chemie sofort?", forms: ["A química vem no começo?"], tags: ["dating"] },

    { topic: "friends_dating", cefr: "C1", skill: "statement", pt: () => `Quando a conversa flui, eu sinto que existe uma conexão real.`, deHint: "Wenn das Gespräch fließt, spüre ich eine echte Verbindung.", forms: ["Quando flui, tem conexão."], tags: ["connection"] },
    { topic: "friends_dating", cefr: "C1", skill: "question", pt: () => `Como você lida com expectativas em um relacionamento novo?`, deHint: "Wie gehst du mit Erwartungen in einer neuen Beziehung um?", forms: ["Como você lida com expectativas?"], tags: ["relationships"] },

    { topic: "friends_dating", cefr: "C2", skill: "statement", pt: () => `Intimidade não é apenas proximidade; é a capacidade de ser visto sem máscara.`, deHint: "Intimität ist nicht nur Nähe, sondern gesehen werden ohne Maske.", forms: ["Intimidade é ser visto de verdade."], tags: ["abstract"] },
    { topic: "friends_dating", cefr: "C2", skill: "question", pt: () => `Até que ponto a cultura influencia a forma como demonstramos afeto?`, deHint: "Wie beeinflusst Kultur, wie wir Zuneigung zeigen?", forms: ["Cultura muda demonstração de afeto?"], tags: ["culture","debate"] }
  ]
};