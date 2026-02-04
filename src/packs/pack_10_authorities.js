// src/packs/pack_10_authorities.js
export const packAuthorities = {
  key: "authorities",
  name: "Authorities",
  enabledByDefault: false,

  BANK: {
    places: ["prefeitura", "cartório", "delegacia", "posto de saúde", "correios"],
    docs: ["documento", "passaporte", "comprovante", "formulário", "assinatura"],
    verbs: ["precisar", "entregar", "preencher", "assinar", "agendar"]
  },

  TEMPLATES: [
    { topic: "authorities", cefr: "A1", skill: "question", pt: () => `Onde fica o cartório?`, deHint: "Wo ist das Standesamt/Notariat?", forms: ["Onde é o cartório?"], tags: ["direction"] },
    { topic: "authorities", cefr: "A1", skill: "statement", pt: () => `Eu preciso de um documento.`, deHint: "Ich brauche ein Dokument.", forms: ["Preciso de um documento."], tags: ["documents"] },

    { topic: "authorities", cefr: "A2", skill: "statement", pt: () => `Tenho que preencher este formulário.`, deHint: "Ich muss dieses Formular ausfüllen.", forms: ["Preciso preencher o formulário."], tags: ["forms"] },
    { topic: "authorities", cefr: "A2", skill: "question", pt: () => `Eu posso agendar um horário?`, deHint: "Kann ich einen Termin vereinbaren?", forms: ["Dá pra agendar?"], tags: ["appointment"] },

    { topic: "authorities", cefr: "B1", skill: "statement", pt: () => `Trouxe o comprovante e uma cópia do passaporte.`, deHint: "Ich habe den Nachweis und eine Passkopie mitgebracht.", forms: ["Tenho o comprovante e a cópia."], tags: ["documents"] },
    { topic: "authorities", cefr: "B1", skill: "question", pt: () => `Quais documentos são necessários para o cadastro?`, deHint: "Welche Unterlagen werden für die Anmeldung benötigt?", forms: ["Que documentos preciso?"], tags: ["requirements"] },

    { topic: "authorities", cefr: "B2", skill: "statement", pt: () => `Preciso esclarecer uma dúvida sobre minha documentação.`, deHint: "Ich muss eine Frage zu meinen Unterlagen klären.", forms: ["Quero tirar uma dúvida."], tags: ["clarify"] },
    { topic: "authorities", cefr: "B2", skill: "question", pt: () => `Existe um prazo para entregar tudo?`, deHint: "Gibt es eine Frist, alles abzugeben?", forms: ["Qual é o prazo?"], tags: ["deadline"] },

    { topic: "authorities", cefr: "C1", skill: "statement", pt: () => `Prefiro receber a confirmação por escrito para evitar confusão depois.`, deHint: "Ich bevorzuge eine schriftliche Bestätigung, um später Verwirrung zu vermeiden.", forms: ["Pode confirmar por escrito?"], tags: ["formal"] },
    { topic: "authorities", cefr: "C1", skill: "question", pt: () => `Com quem eu devo falar para resolver esse processo?`, deHint: "Mit wem muss ich sprechen, um den Vorgang zu lösen?", forms: ["Quem pode resolver isso?"], tags: ["process"] },

    { topic: "authorities", cefr: "C2", skill: "statement", pt: () => `A burocracia tende a punir quem não domina a linguagem institucional.`, deHint: "Bürokratie benachteiligt oft, wer die institutionelle Sprache nicht beherrscht.", forms: ["A linguagem institucional pesa."], tags: ["abstract"] },
    { topic: "authorities", cefr: "C2", skill: "question", pt: () => `Você acha que a burocracia protege direitos ou cria barreiras desnecessárias?`, deHint: "Schützt Bürokratie Rechte oder schafft sie unnötige Hürden?", forms: ["Burocracia protege ou atrapalha?"], tags: ["debate"] }
  ]
};