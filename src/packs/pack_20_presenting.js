// src/packs/pack_20_presenting.js
export const packPresenting = {
  key: "presenting",
  name: "Presenting",
  enabledByDefault: false,

  BANK: {
    verbs: ["apresentar", "explicar", "mostrar", "resumir", "concluir"],
    connectors: ["primeiro", "em seguida", "por outro lado", "no final", "em resumo"],
    audience: ["pessoal", "time", "clientes", "participantes", "público"]
  },

  TEMPLATES: [
    { topic: "presenting", cefr: "A1", skill: "statement", pt: () => `Eu vou apresentar agora.`, deHint: "Ich werde jetzt präsentieren.", forms: ["Vou apresentar."], tags: ["presentation"] },
    { topic: "presenting", cefr: "A1", skill: "question", pt: () => `Você pode repetir, por favor?`, deHint: "Kannst du bitte wiederholen?", forms: ["Repete, por favor?"], tags: ["clarify"] },

    { topic: "presenting", cefr: "A2", skill: "statement", pt: () => `Primeiro, vou explicar o plano.`, deHint: "Zuerst erkläre ich den Plan.", forms: ["Primeiro, explico o plano."], tags: ["structure"] },
    { topic: "presenting", cefr: "A2", skill: "question", pt: () => `Está claro até aqui?`, deHint: "Ist es bis hier klar?", forms: ["Tudo certo até aqui?"], tags: ["check"] },

    { topic: "presenting", cefr: "B1", skill: "statement", pt: () => `Em seguida, vou mostrar um exemplo prático.`, deHint: "Als Nächstes zeige ich ein praktisches Beispiel.", forms: ["Depois, mostro um exemplo."], tags: ["structure"] },
    { topic: "presenting", cefr: "B1", skill: "question", pt: () => `Você pode me dar um feedback rápido no final?`, deHint: "Kannst du mir am Ende kurzes Feedback geben?", forms: ["Me dá um feedback no final?"], tags: ["feedback"] },

    { topic: "presenting", cefr: "B2", skill: "statement", pt: () => `O objetivo desta apresentação é alinhar expectativas e próximos passos.`, deHint: "Ziel ist Erwartungen und nächste Schritte abzustimmen.", forms: ["O objetivo é alinhar próximos passos."], tags: ["goal"] },
    { topic: "presenting", cefr: "B2", skill: "question", pt: () => `Qual parte você acha mais relevante para o time?`, deHint: "Welcher Teil ist fürs Team am relevantesten?", forms: ["O que é mais relevante?"], tags: ["relevance"] },

    { topic: "presenting", cefr: "C1", skill: "statement", pt: () => `Vou contextualizar rapidamente antes de entrar nos detalhes técnicos.`, deHint: "Ich gebe kurz Kontext, bevor ich in technische Details gehe.", forms: ["Vou dar contexto antes dos detalhes."], tags: ["context"] },
    { topic: "presenting", cefr: "C1", skill: "question", pt: () => `Se surgir dúvida, prefiro parar e esclarecer na hora.`, deHint: "Wenn Fragen auftauchen, kläre ich sie lieber sofort.", forms: ["Se houver dúvida, eu esclareço."], tags: ["facilitation"] },

    { topic: "presenting", cefr: "C2", skill: "statement", pt: () => `Uma boa apresentação não informa apenas; ela reorganiza a atenção do público.`, deHint: "Gute Präsentation informiert nicht nur, sie ordnet Aufmerksamkeit neu.", forms: ["Apresentar é guiar atenção."], tags: ["abstract"] },
    { topic: "presenting", cefr: "C2", skill: "question", pt: () => `Como você adapta a mesma mensagem para públicos com níveis diferentes?`, deHint: "Wie passt du dieselbe Botschaft an verschiedene Zielgruppen an?", forms: ["Como adaptar a mensagem ao público?"], tags: ["strategy"] }
  ]
};