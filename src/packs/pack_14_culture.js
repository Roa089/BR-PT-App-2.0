// src/packs/pack_14_culture.js
export const packCulture = {
  key: "culture",
  name: "Culture",
  enabledByDefault: false,

  BANK: {
    culture: ["música", "filme", "arte", "festa", "tradição", "história"],
    verbs: ["assistir", "ouvir", "visitar", "aprender", "celebrar"]
  },

  TEMPLATES: [
    { topic: "culture", cefr: "A1", skill: "statement", pt: () => `Eu gosto de música brasileira.`, deHint: "Ich mag brasilianische Musik.", forms: ["Gosto de música do Brasil."], tags: ["music"] },
    { topic: "culture", cefr: "A1", skill: "question", pt: () => `Você gosta de filme?`, deHint: "Magst du Filme?", forms: ["Você curte filme?"], tags: ["movies"] },

    { topic: "culture", cefr: "A2", skill: "statement", pt: () => `Quero visitar um museu hoje.`, deHint: "Ich möchte heute ein Museum besuchen.", forms: ["Vou ao museu hoje."], tags: ["art"] },
    { topic: "culture", cefr: "A2", skill: "question", pt: () => `Qual música você recomenda?`, deHint: "Welches Lied empfiehlst du?", forms: ["Me recomenda uma música?"], tags: ["recommendation"] },

    { topic: "culture", cefr: "B1", skill: "statement", pt: () => `Assisti a um filme brasileiro e gostei do sotaque.`, deHint: "Ich sah einen brasilianischen Film und mochte den Akzent.", forms: ["Vi um filme brasileiro e curti o sotaque."], tags: ["movies","language"] },
    { topic: "culture", cefr: "B1", skill: "question", pt: () => `Qual festa é mais importante na sua cidade?`, deHint: "Welches Fest ist in deiner Stadt am wichtigsten?", forms: ["Qual é a festa principal?"], tags: ["tradition"] },

    { topic: "culture", cefr: "B2", skill: "statement", pt: () => `A cultura local muda quando muita gente de fora chega.`, deHint: "Lokale Kultur verändert sich, wenn viele von außen kommen.", forms: ["Cultura muda com gente de fora."], tags: ["change"] },
    { topic: "culture", cefr: "B2", skill: "question", pt: () => `Você acha que tradição e modernidade podem coexistir?`, deHint: "Können Tradition und Moderne koexistieren?", forms: ["Tradição e modernidade juntas?"], tags: ["opinion"] },

    { topic: "culture", cefr: "C1", skill: "statement", pt: () => `Quando entendemos referências culturais, a língua fica muito mais viva.`, deHint: "Wenn wir kulturelle Referenzen verstehen, wird Sprache lebendig.", forms: ["Referências culturais dão vida à língua."], tags: ["learning"] },
    { topic: "culture", cefr: "C1", skill: "question", pt: () => `De que forma a arte pode influenciar debates sociais?`, deHint: "Wie kann Kunst gesellschaftliche Debatten beeinflussen?", forms: ["Arte influencia debates?"], tags: ["impact"] },

    { topic: "culture", cefr: "C2", skill: "statement", pt: () => `Cultura não é um objeto; é um processo contínuo de negociação de sentidos.`, deHint: "Kultur ist kein Objekt, sondern ein fortlaufender Prozess.", forms: ["Cultura é negociação de sentidos."], tags: ["abstract"] },
    { topic: "culture", cefr: "C2", skill: "question", pt: () => `Você acredita que globalização empobrece ou enriquece culturas?`, deHint: "Verarmt oder bereichert Globalisierung Kulturen?", forms: ["Globalização empobrece ou enriquece?"], tags: ["debate"] }
  ]
};