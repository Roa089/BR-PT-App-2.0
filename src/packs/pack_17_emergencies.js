// src/packs/pack_17_emergencies.js
export const packEmergencies = {
  key: "emergencies",
  name: "Emergencies",
  enabledByDefault: false,

  BANK: {
    emergencies: ["acidente", "emergência", "dor forte", "perdi minha carteira", "meu celular sumiu"],
    verbs: ["precisar", "chamar", "ajudar", "socorrer", "procurar"],
    places: ["hospital", "farmácia", "delegacia", "rua", "hotel"]
  },

  TEMPLATES: [
    { topic: "emergencies", cefr: "A1", skill: "statement", pt: () => `Eu preciso de ajuda.`, deHint: "Ich brauche Hilfe.", forms: ["Preciso de ajuda!"], tags: ["help"] },
    { topic: "emergencies", cefr: "A1", skill: "question", pt: () => `Você pode me ajudar?`, deHint: "Kannst du mir helfen?", forms: ["Pode me ajudar?"], tags: ["help"] },

    { topic: "emergencies", cefr: "A2", skill: "statement", pt: () => `Eu perdi minha carteira.`, deHint: "Ich habe meine Geldbörse verloren.", forms: ["Perdi a carteira."], tags: ["lost"] },
    { topic: "emergencies", cefr: "A2", skill: "question", pt: () => `Onde fica a farmácia mais próxima?`, deHint: "Wo ist die nächste Apotheke?", forms: ["Tem farmácia perto?"], tags: ["health"] },

    { topic: "emergencies", cefr: "B1", skill: "statement", pt: () => `Estou com uma dor forte e preciso ir ao hospital.`, deHint: "Ich habe starke Schmerzen und muss ins Krankenhaus.", forms: ["A dor está forte; preciso de hospital."], tags: ["medical"] },
    { topic: "emergencies", cefr: "B1", skill: "question", pt: () => `Você pode chamar uma ambulância, por favor?`, deHint: "Können Sie bitte einen Krankenwagen rufen?", forms: ["Chama uma ambulância?"], tags: ["medical"] },

    { topic: "emergencies", cefr: "B2", skill: "statement", pt: () => `Meu celular sumiu; vou bloquear o chip e avisar o banco.`, deHint: "Mein Handy ist weg; ich sperre die SIM und informiere die Bank.", forms: ["Vou bloquear tudo e avisar o banco."], tags: ["security"] },
    { topic: "emergencies", cefr: "B2", skill: "question", pt: () => `Você viu alguém pegando uma mochila preta?`, deHint: "Hast du jemanden mit einem schwarzen Rucksack gesehen?", forms: ["Você viu uma mochila preta?"], tags: ["search"] },

    { topic: "emergencies", cefr: "C1", skill: "statement", pt: () => `Em situações de crise, eu tento falar devagar para evitar confusões.`, deHint: "In Krisen spreche ich langsam, um Missverständnisse zu vermeiden.", forms: ["Eu falo devagar em crise."], tags: ["strategy"] },
    { topic: "emergencies", cefr: "C1", skill: "question", pt: () => `Que informações você precisa para registrar um boletim?`, deHint: "Welche Infos brauchst du für eine Anzeige?", forms: ["O que precisa para o boletim?"], tags: ["police"] },

    { topic: "emergencies", cefr: "C2", skill: "statement", pt: () => `A clareza comunicativa em emergências pode literalmente salvar tempo — e vidas.`, deHint: "Klare Kommunikation in Notfällen kann Zeit — und Leben — retten.", forms: ["Clareza em emergência salva vidas."], tags: ["abstract"] },
    { topic: "emergencies", cefr: "C2", skill: "question", pt: () => `Como equilibrar urgência e precisão quando as emoções estão no limite?`, deHint: "Wie balanciert man Dringlichkeit und Präzision unter Stress?", forms: ["Urgência vs precisão sob emoção?"], tags: ["debate"] }
  ]
};