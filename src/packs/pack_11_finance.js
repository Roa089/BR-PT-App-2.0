// src/packs/pack_11_finance.js
export const packFinance = {
  key: "finance",
  name: "Finance",
  enabledByDefault: true,

  BANK: {
    money: ["dinheiro", "cartão", "pix", "conta", "saldo", "taxa"],
    verbs: ["pagar", "economizar", "investir", "cobrar", "transferir"],
    places: ["banco", "caixa", "loja", "mercado"]
  },

  TEMPLATES: [
    { topic: "finance", cefr: "A1", skill: "question", pt: () => `Você aceita cartão?`, deHint: "Nehmen Sie Karte?", forms: ["Aceita cartão?"], tags: ["payment"] },
    { topic: "finance", cefr: "A1", skill: "statement", pt: () => `Eu vou pagar no pix.`, deHint: "Ich zahle per Pix.", forms: ["Vou pagar com pix."], tags: ["payment"] },

    { topic: "finance", cefr: "A2", skill: "statement", pt: () => `Meu saldo está baixo este mês.`, deHint: "Mein Kontostand ist diesen Monat niedrig.", forms: ["Estou com pouco saldo."], tags: ["budget"] },
    { topic: "finance", cefr: "A2", skill: "question", pt: () => `Qual é o valor da taxa?`, deHint: "Wie hoch ist die Gebühr?", forms: ["Quanto custa a taxa?"], tags: ["fees"] },

    { topic: "finance", cefr: "B1", skill: "statement", pt: () => `Estou tentando economizar para uma viagem.`, deHint: "Ich versuche für eine Reise zu sparen.", forms: ["Quero guardar dinheiro pra viajar."], tags: ["saving"] },
    { topic: "finance", cefr: "B1", skill: "question", pt: () => `Você controla seus gastos no dia a dia?`, deHint: "Kontrollierst du deine täglichen Ausgaben?", forms: ["Você acompanha seus gastos?"], tags: ["habits"] },

    { topic: "finance", cefr: "B2", skill: "statement", pt: () => `Prefiro pagar à vista para evitar juros.`, deHint: "Ich zahle lieber sofort, um Zinsen zu vermeiden.", forms: ["Pago à vista pra não ter juros."], tags: ["decision"] },
    { topic: "finance", cefr: "B2", skill: "question", pt: () => `Você acha melhor investir ou quitar dívidas primeiro?`, deHint: "Erst investieren oder Schulden tilgen?", forms: ["Investir ou pagar dívidas?"], tags: ["opinion"] },

    { topic: "finance", cefr: "C1", skill: "statement", pt: () => `Ter clareza financeira reduz ansiedade e melhora o planejamento.`, deHint: "Finanzielle Klarheit reduziert Angst und verbessert Planung.", forms: ["Clareza financeira ajuda no planejamento."], tags: ["analysis"] },
    { topic: "finance", cefr: "C1", skill: "question", pt: () => `Como você decide se uma compra realmente vale a pena?`, deHint: "Wie entscheidest du, ob sich ein Kauf lohnt?", forms: ["Como você avalia uma compra?"], tags: ["decision"] },

    { topic: "finance", cefr: "C2", skill: "statement", pt: () => `O comportamento financeiro costuma ser mais emocional do que racional.`, deHint: "Finanzverhalten ist oft emotionaler als rational.", forms: ["Dinheiro mexe com emoção."], tags: ["abstract"] },
    { topic: "finance", cefr: "C2", skill: "question", pt: () => `Você acredita que educação financeira deveria ser obrigatória na escola?`, deHint: "Sollte Finanzbildung Pflichtfach sein?", forms: ["Educação financeira na escola?"], tags: ["debate"] }
  ]
};