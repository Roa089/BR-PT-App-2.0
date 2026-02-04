// src/packs/pack_03_food.js
export const packFood = {
  key: "food",
  name: "Food",
  enabledByDefault: true,

  BANK: {
    foods: ["arroz", "feijão", "carne", "salada", "fruta"],
    drinks: ["água", "suco", "café", "chá"],
    verbs: ["comer", "beber", "preparar", "cozinhar", "pedir"]
  },

  TEMPLATES: [
    { topic: "food", cefr: "A1", skill: "statement", pt: () => `Eu gosto de arroz.`, deHint: "Ich mag Reis.", forms: ["Gosto de arroz."], tags: ["preference"] },
    { topic: "food", cefr: "A1", skill: "question", pt: () => `Você quer água?`, deHint: "Willst du Wasser?", forms: ["Quer água?"], tags: ["offer"] },

    { topic: "food", cefr: "A2", skill: "statement", pt: () => `Vou preparar o almoço agora.`, deHint: "Ich werde jetzt das Mittagessen zubereiten.", forms: ["Vou cozinhar agora."], tags: ["routine"] },
    { topic: "food", cefr: "A2", skill: "question", pt: () => `O que você vai comer hoje?`, deHint: "Was wirst du heute essen?", forms: ["O que come hoje?"], tags: ["meal"] },

    { topic: "food", cefr: "B1", skill: "statement", pt: () => `Prefiro comida caseira a fast food.`, deHint: "Ich bevorzuge Hausmannskost gegenüber Fast Food.", forms: ["Gosto mais de comida caseira."], tags: ["preference"] },
    { topic: "food", cefr: "B1", skill: "question", pt: () => `Você costuma cozinhar durante a semana?`, deHint: "Kochst du unter der Woche?", forms: ["Você cozinha na semana?"], tags: ["habit"] },

    { topic: "food", cefr: "B2", skill: "statement", pt: () => `A alimentação influencia diretamente nossa saúde.`, deHint: "Ernährung beeinflusst direkt unsere Gesundheit.", forms: ["O que comemos afeta a saúde."], tags: ["health"] },
    { topic: "food", cefr: "B2", skill: "question", pt: () => `Quais pratos você considera mais saudáveis?`, deHint: "Welche Gerichte hältst du für gesünder?", forms: ["Quais comidas são mais saudáveis?"], tags: ["opinion"] },

    { topic: "food", cefr: "C1", skill: "statement", pt: () => `Os hábitos alimentares refletem aspectos culturais profundos.`, deHint: "Essgewohnheiten spiegeln kulturelle Aspekte wider.", forms: ["Comer reflete cultura."], tags: ["culture"] },
    { topic: "food", cefr: "C1", skill: "question", pt: () => `De que modo a culinária expressa identidade regional?`, deHint: "Wie drückt Küche regionale Identität aus?", forms: ["Como a comida mostra a cultura?"], tags: ["identity"] },

    { topic: "food", cefr: "C2", skill: "statement", pt: () => `A relação entre alimentação e sociedade vai além da simples nutrição.`, deHint: "Die Beziehung zwischen Essen und Gesellschaft geht über Ernährung hinaus.", forms: ["Comer é mais que nutrir."], tags: ["abstract"] },
    { topic: "food", cefr: "C2", skill: "question", pt: () => `Você acha que a gastronomia pode ser considerada uma forma de arte?`, deHint: "Ist Gastronomie eine Kunstform?", forms: ["Cozinhar é arte?"], tags: ["philosophy"] }
  ]
};