// src/packs/pack_02_travel.js
export const packTravel = {
  key: "travel",
  name: "Travel",
  enabledByDefault: true,

  BANK: {
    places: ["aeroporto", "hotel", "estação", "centro da cidade", "praia"],
    verbs: ["chegar", "partir", "reservar", "visitar", "explorar"],
    transport: ["ônibus", "metrô", "táxi", "avião", "trem"]
  },

  TEMPLATES: [
    { topic: "travel", cefr: "A1", skill: "statement", pt: () => `Eu vou ao aeroporto.`, deHint: "Ich gehe zum Flughafen.", forms: ["Vou para o aeroporto."], tags: ["movement"] },
    { topic: "travel", cefr: "A1", skill: "question", pt: () => `Onde fica o hotel?`, deHint: "Wo ist das Hotel?", forms: ["Onde é o hotel?"], tags: ["direction"] },

    { topic: "travel", cefr: "A2", skill: "statement", pt: () => `Preciso comprar uma passagem de trem.`, deHint: "Ich muss ein Zugticket kaufen.", forms: ["Quero comprar uma passagem."], tags: ["ticket"] },
    { topic: "travel", cefr: "A2", skill: "question", pt: () => `Qual ônibus vai para o centro?`, deHint: "Welcher Bus fährt ins Zentrum?", forms: ["Que ônibus pega o centro?"], tags: ["transport"] },

    { topic: "travel", cefr: "B1", skill: "statement", pt: () => `Cheguei ao hotel depois de uma longa viagem.`, deHint: "Ich kam nach einer langen Reise im Hotel an.", forms: ["Cheguei cansado ao hotel."], tags: ["arrival"] },
    { topic: "travel", cefr: "B1", skill: "question", pt: () => `Você já visitou este lugar antes?`, deHint: "Warst du schon einmal hier?", forms: ["Já esteve aqui?"], tags: ["experience"] },

    { topic: "travel", cefr: "B2", skill: "statement", pt: () => `Prefiro viajar de trem porque é mais confortável.`, deHint: "Ich reise lieber mit dem Zug, weil es bequemer ist.", forms: ["Viajar de trem é melhor para mim."], tags: ["preference"] },
    { topic: "travel", cefr: "B2", skill: "question", pt: () => `Quais lugares você recomenda visitar?`, deHint: "Welche Orte empfiehlst du?", forms: ["O que você recomenda?"], tags: ["recommendation"] },

    { topic: "travel", cefr: "C1", skill: "statement", pt: () => `Viajar amplia nossa percepção cultural e pessoal.`, deHint: "Reisen erweitert unsere kulturelle und persönliche Wahrnehmung.", forms: ["Viajar muda nossa visão."], tags: ["reflection"] },
    { topic: "travel", cefr: "C1", skill: "question", pt: () => `De que maneira o turismo afeta a identidade local?`, deHint: "Wie beeinflusst Tourismus die lokale Identität?", forms: ["Como o turismo muda os lugares?"], tags: ["impact"] },

    { topic: "travel", cefr: "C2", skill: "statement", pt: () => `O deslocamento físico muitas vezes provoca uma transformação interior.`, deHint: "Reisen bewirkt oft eine innere Veränderung.", forms: ["Viajar transforma por dentro."], tags: ["abstract"] },
    { topic: "travel", cefr: "C2", skill: "question", pt: () => `Você considera a viagem mais importante que o destino?`, deHint: "Ist der Weg wichtiger als das Ziel?", forms: ["A viagem vale mais que o destino?"], tags: ["philosophy"] }
  ]
};