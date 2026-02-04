// src/packs/pack_19_negotiation.js
export const packNegotiation = {
  key: "negotiation",
  name: "Negotiation",
  enabledByDefault: false,

  BANK: {
    verbs: ["negociar", "combinar", "acertar", "fechar", "rever"],
    phrases: ["faz sentido", "podemos ajustar", "vamos alinhar", "qual é o limite", "eu proponho"],
    money: ["preço", "desconto", "prazo", "condições", "contrato"]
  },

  TEMPLATES: [
    { topic: "negotiation", cefr: "A1", skill: "question", pt: () => `Quanto custa?`, deHint: "Wie viel kostet das?", forms: ["Qual é o preço?"], tags: ["price"] },
    { topic: "negotiation", cefr: "A1", skill: "statement", pt: () => `Eu quero um desconto.`, deHint: "Ich möchte einen Rabatt.", forms: ["Quero desconto."], tags: ["discount"] },

    { topic: "negotiation", cefr: "A2", skill: "question", pt: () => `Você pode fazer por menos?`, deHint: "Kannst du es günstiger machen?", forms: ["Dá pra baixar o preço?"], tags: ["price"] },
    { topic: "negotiation", cefr: "A2", skill: "statement", pt: () => `Podemos combinar um prazo melhor.`, deHint: "Wir können eine bessere Frist vereinbaren.", forms: ["Dá pra ajustar o prazo."], tags: ["deadline"] },

    { topic: "negotiation", cefr: "B1", skill: "statement", pt: () => `Se você incluir a entrega, eu fecho hoje.`, deHint: "Wenn du die Lieferung einschließt, mache ich heute fest.", forms: ["Inclui a entrega que fecho hoje."], tags: ["deal"] },
    { topic: "negotiation", cefr: "B1", skill: "question", pt: () => `Qual é o seu orçamento para isso?`, deHint: "Was ist dein Budget dafür?", forms: ["Qual seu orçamento?"], tags: ["budget"] },

    { topic: "negotiation", cefr: "B2", skill: "statement", pt: () => `Eu entendo seu ponto, mas preciso de condições mais claras.`, deHint: "Ich verstehe deinen Punkt, brauche aber klarere Bedingungen.", forms: ["Entendo, mas preciso de clareza."], tags: ["clarify"] },
    { topic: "negotiation", cefr: "B2", skill: "question", pt: () => `Se eu aceitar isso, o que você consegue melhorar do outro lado?`, deHint: "Wenn ich das akzeptiere, was kannst du auf der anderen Seite verbessern?", forms: ["Se eu aceitar, o que melhora?"], tags: ["tradeoff"] },

    { topic: "negotiation", cefr: "C1", skill: "statement", pt: () => `Prefiro alinhar expectativas agora para evitar retrabalho depois.`, deHint: "Ich kläre Erwartungen jetzt, um später Nacharbeit zu vermeiden.", forms: ["Vamos alinhar expectativas agora."], tags: ["process"] },
    { topic: "negotiation", cefr: "C1", skill: "question", pt: () => `Quais critérios são inegociáveis para você?`, deHint: "Welche Kriterien sind für dich nicht verhandelbar?", forms: ["O que é inegociável?"], tags: ["criteria"] },

    { topic: "negotiation", cefr: "C2", skill: "statement", pt: () => `Uma boa negociação transforma posições rígidas em interesses compreensíveis.`, deHint: "Gute Verhandlung verwandelt Positionen in verständliche Interessen.", forms: ["Negociar é traduzir interesses."], tags: ["abstract"] },
    { topic: "negotiation", cefr: "C2", skill: "question", pt: () => `Como você distingue firmeza de inflexibilidade em um acordo?`, deHint: "Wie unterscheidest du Standhaftigkeit von Starrheit?", forms: ["Firmeza ou rigidez?"], tags: ["debate"] }
  ]
};