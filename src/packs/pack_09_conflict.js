// src/packs/pack_09_conflict.js
export const packConflict = {
  key: "conflict",
  name: "Conflict",
  enabledByDefault: true,

  BANK: {
    phrases: ["desculpa", "não foi minha intenção", "vamos conversar", "prefiro resolver agora"],
    problems: ["mal-entendido", "atraso", "barulho", "falta de respeito", "diferença de opinião"],
    verbs: ["resolver", "explicar", "pedir", "aceitar", "discordar"]
  },

  TEMPLATES: [
    { topic: "conflict", cefr: "A1", skill: "statement", pt: () => `Desculpa, eu errei.`, deHint: "Entschuldigung, ich habe einen Fehler gemacht.", forms: ["Foi mal, eu errei."], tags: ["apology"] },
    { topic: "conflict", cefr: "A1", skill: "question", pt: () => `Você está bravo?`, deHint: "Bist du wütend?", forms: ["Tá bravo?"], tags: ["emotion","question"] },

    { topic: "conflict", cefr: "A2", skill: "statement", pt: () => `Não foi minha intenção te magoar.`, deHint: "Es war nicht meine Absicht, dich zu verletzen.", forms: ["Eu não quis te magoar."], tags: ["apology"] },
    { topic: "conflict", cefr: "A2", skill: "question", pt: () => `Podemos conversar um minuto?`, deHint: "Können wir eine Minute reden?", forms: ["Dá pra conversar?"], tags: ["request"] },

    { topic: "conflict", cefr: "B1", skill: "statement", pt: () => `Acho que houve um mal-entendido, vamos esclarecer.`, deHint: "Ich glaube, es gab ein Missverständnis, lass es klären.", forms: ["Parece um mal-entendido."], tags: ["clarify"] },
    { topic: "conflict", cefr: "B1", skill: "question", pt: () => `O que exatamente te incomodou?`, deHint: "Was genau hat dich gestört?", forms: ["O que te incomodou?"], tags: ["problem"] },

    { topic: "conflict", cefr: "B2", skill: "statement", pt: () => `Eu discordo, mas respeito seu ponto de vista.`, deHint: "Ich bin anderer Meinung, respektiere aber deinen Standpunkt.", forms: ["Discordo, porém respeito."], tags: ["disagree","respect"] },
    { topic: "conflict", cefr: "B2", skill: "question", pt: () => `Como podemos resolver isso de forma justa para os dois?`, deHint: "Wie lösen wir das fair für beide?", forms: ["Como resolver de forma justa?"], tags: ["solution"] },

    { topic: "conflict", cefr: "C1", skill: "statement", pt: () => `Quando a conversa esquenta, tento voltar ao que é realmente importante.`, deHint: "Wenn das Gespräch hitzig wird, kehre ich zum Wesentlichen zurück.", forms: ["Eu volto ao ponto principal."], tags: ["strategy"] },
    { topic: "conflict", cefr: "C1", skill: "question", pt: () => `Você prefere resolver conflitos na hora ou depois de esfriar?`, deHint: "Klärst du Konflikte sofort oder später?", forms: ["Resolver agora ou depois?"], tags: ["preference"] },

    { topic: "conflict", cefr: "C2", skill: "statement", pt: () => `Conflitos persistem quando as necessidades não são nomeadas com precisão.`, deHint: "Konflikte bleiben, wenn Bedürfnisse nicht präzise benannt werden.", forms: ["Necessidades não ditas mantêm conflitos."], tags: ["abstract"] },
    { topic: "conflict", cefr: "C2", skill: "question", pt: () => `Até que ponto a busca por “harmonia” pode silenciar problemas reais?`, deHint: "Inwiefern kann Harmonie echte Probleme unterdrücken?", forms: ["Harmonia pode esconder problemas?"], tags: ["debate"] }
  ]
};