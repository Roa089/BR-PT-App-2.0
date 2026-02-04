// src/packs/pack_16_housing.js
export const packHousing = {
  key: "housing",
  name: "Housing",
  enabledByDefault: true,

  BANK: {
    rooms: ["quarto", "cozinha", "banheiro", "sala", "varanda"],
    issues: ["vazamento", "barulho", "mofo", "internet lenta", "chave quebrada"],
    verbs: ["alugar", "morar", "consertar", "limpar", "reclamar"]
  },

  TEMPLATES: [
    { topic: "housing", cefr: "A1", skill: "statement", pt: () => `Eu moro aqui.`, deHint: "Ich wohne hier.", forms: ["Moro aqui."], tags: ["living"] },
    { topic: "housing", cefr: "A1", skill: "question", pt: () => `Onde fica o banheiro?`, deHint: "Wo ist das Badezimmer?", forms: ["Cadê o banheiro?"], tags: ["home"] },

    { topic: "housing", cefr: "A2", skill: "statement", pt: () => `A chave não está funcionando.`, deHint: "Der Schlüssel funktioniert nicht.", forms: ["A chave não funciona."], tags: ["issue"] },
    { topic: "housing", cefr: "A2", skill: "question", pt: () => `Você pode me mostrar a cozinha?`, deHint: "Kannst du mir die Küche zeigen?", forms: ["Me mostra a cozinha?"], tags: ["tour"] },

    { topic: "housing", cefr: "B1", skill: "statement", pt: () => `Tem um vazamento na cozinha e preciso consertar.`, deHint: "Es gibt ein Leck in der Küche und ich muss es reparieren.", forms: ["Está vazando na cozinha."], tags: ["repair"] },
    { topic: "housing", cefr: "B1", skill: "question", pt: () => `Quanto custa o aluguel por mês, com contas?`, deHint: "Wie viel kostet die Miete pro Monat inkl. Nebenkosten?", forms: ["Quanto é o aluguel com contas?"], tags: ["rent"] },

    { topic: "housing", cefr: "B2", skill: "statement", pt: () => `Eu prefiro um lugar silencioso, mesmo que seja um pouco menor.`, deHint: "Ich bevorzuge einen ruhigen Ort, selbst wenn er kleiner ist.", forms: ["Prefiro silêncio a espaço."], tags: ["preference"] },
    { topic: "housing", cefr: "B2", skill: "question", pt: () => `Você já teve problema com vizinhos barulhentos?`, deHint: "Hattest du schon Probleme mit lauten Nachbarn?", forms: ["Já teve vizinho barulhento?"], tags: ["neighbors"] },

    { topic: "housing", cefr: "C1", skill: "statement", pt: () => `Quando eu organizo a casa, minha cabeça também fica mais leve.`, deHint: "Wenn ich die Wohnung ordne, wird mein Kopf leichter.", forms: ["Organização ajuda meu bem-estar."], tags: ["wellbeing"] },
    { topic: "housing", cefr: "C1", skill: "question", pt: () => `Que critérios você considera essenciais ao escolher um lugar para morar?`, deHint: "Welche Kriterien sind dir bei der Wohnungswahl wichtig?", forms: ["Quais critérios são essenciais?"], tags: ["decision"] },

    { topic: "housing", cefr: "C2", skill: "statement", pt: () => `Habitar um espaço é também construir rotinas, limites e pertencimento.`, deHint: "Einen Raum zu bewohnen heißt auch Routinen, Grenzen und Zugehörigkeit aufzubauen.", forms: ["Morar é construir pertencimento."], tags: ["abstract"] },
    { topic: "housing", cefr: "C2", skill: "question", pt: () => `Você acha que a forma de morar influencia a forma de pensar?`, deHint: "Beeinflusst Wohnform das Denken?", forms: ["Morar muda o jeito de pensar?"], tags: ["debate"] }
  ]
};