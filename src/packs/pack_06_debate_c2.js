// src/packs/pack_06_debate_c2.js
export const packDebate = {
  key: "debate_c2",
  name: "Debate C2",
  enabledByDefault: false,

  BANK: {
    connectors: ["portanto", "além disso", "no entanto", "consequentemente"],
    concepts: ["sociedade", "liberdade", "tecnologia", "educação"]
  },

  TEMPLATES: [
    { topic: "debate", cefr: "A1", skill: "statement", pt: () => `Isso é importante.`, deHint: "Das ist wichtig.", forms: ["É importante."], tags: ["simple"] },
    { topic: "debate", cefr: "A2", skill: "question", pt: () => `Por que isso é importante?`, deHint: "Warum ist das wichtig?", forms: ["Por que é importante?"], tags: ["why"] },

    { topic: "debate", cefr: "B1", skill: "statement", pt: () => `A tecnologia muda nossa vida diária.`, deHint: "Technologie verändert unser tägliches Leben.", forms: ["Tecnologia muda a vida."], tags: ["tech"] },
    { topic: "debate", cefr: "B1", skill: "question", pt: () => `Você concorda com essa ideia?`, deHint: "Stimmst du dieser Idee zu?", forms: ["Você concorda?"], tags: ["agreement"] },

    { topic: "debate", cefr: "B2", skill: "statement", pt: () => `A educação influencia diretamente o desenvolvimento social.`, deHint: "Bildung beeinflusst die soziale Entwicklung.", forms: ["Educação muda a sociedade."], tags: ["education"] },
    { topic: "debate", cefr: "B2", skill: "question", pt: () => `Quais são as consequências dessa mudança?`, deHint: "Was sind die Folgen dieser Veränderung?", forms: ["Quais consequências?"], tags: ["effect"] },

    { topic: "debate", cefr: "C1", skill: "statement", pt: () => `A liberdade individual deve ser equilibrada com a responsabilidade coletiva.`, deHint: "Individuelle Freiheit muss mit kollektiver Verantwortung ausgeglichen werden.", forms: ["Liberdade exige responsabilidade."], tags: ["ethics"] },
    { topic: "debate", cefr: "C1", skill: "question", pt: () => `Como podemos conciliar progresso e justiça social?`, deHint: "Wie kann man Fortschritt und soziale Gerechtigkeit verbinden?", forms: ["Como unir progresso e justiça?"], tags: ["justice"] },

    { topic: "debate", cefr: "C2", skill: "statement", pt: () => `O discurso político contemporâneo reflete tensões históricas não resolvidas.`, deHint: "Zeitgenössischer politischer Diskurs spiegelt ungelöste historische Spannungen wider.", forms: ["A política mostra conflitos antigos."], tags: ["politics"] },
    { topic: "debate", cefr: "C2", skill: "question", pt: () => `Até que ponto a tecnologia redefine os limites da autonomia humana?`, deHint: "Inwiefern definiert Technologie menschliche Autonomie neu?", forms: ["Tecnologia muda a autonomia?"], tags: ["philosophy"] }
  ]
};