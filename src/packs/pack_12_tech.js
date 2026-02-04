// src/packs/pack_12_tech.js
export const packTech = {
  key: "tech",
  name: "Tech",
  enabledByDefault: true,

  BANK: {
    devices: ["celular", "computador", "carregador", "wifi", "app", "senha"],
    verbs: ["baixar", "atualizar", "conectar", "reiniciar", "configurar"]
  },

  TEMPLATES: [
    { topic: "tech", cefr: "A1", skill: "statement", pt: () => `Meu celular está sem bateria.`, deHint: "Mein Handy hat keinen Akku.", forms: ["O celular acabou a bateria."], tags: ["device"] },
    { topic: "tech", cefr: "A1", skill: "question", pt: () => `Tem wifi aqui?`, deHint: "Gibt es hier WLAN?", forms: ["Tem Wi-Fi?"], tags: ["wifi"] },

    { topic: "tech", cefr: "A2", skill: "statement", pt: () => `Preciso conectar no wifi do hotel.`, deHint: "Ich muss mich mit dem Hotel-WLAN verbinden.", forms: ["Quero conectar no Wi-Fi."], tags: ["wifi"] },
    { topic: "tech", cefr: "A2", skill: "question", pt: () => `Qual é a senha do wifi?`, deHint: "Wie lautet das WLAN-Passwort?", forms: ["Qual a senha do Wi-Fi?"], tags: ["wifi"] },

    { topic: "tech", cefr: "B1", skill: "statement", pt: () => `O aplicativo travou, vou reiniciar o celular.`, deHint: "Die App ist abgestürzt, ich starte das Handy neu.", forms: ["A app travou; vou reiniciar."], tags: ["troubleshoot"] },
    { topic: "tech", cefr: "B1", skill: "question", pt: () => `Você pode me enviar o link por mensagem?`, deHint: "Kannst du mir den Link per Nachricht schicken?", forms: ["Me manda o link?"], tags: ["sharing"] },

    { topic: "tech", cefr: "B2", skill: "statement", pt: () => `Eu atualizei o sistema, mas o problema continua.`, deHint: "Ich habe das System aktualisiert, aber das Problem bleibt.", forms: ["Atualizei e não resolveu."], tags: ["issue"] },
    { topic: "tech", cefr: "B2", skill: "question", pt: () => `Você prefere usar Android ou iPhone, e por quê?`, deHint: "Android oder iPhone, und warum?", forms: ["Android ou iPhone? Por quê?"], tags: ["opinion"] },

    { topic: "tech", cefr: "C1", skill: "statement", pt: () => `Privacidade digital exige hábitos simples, mas consistentes.`, deHint: "Digitale Privatsphäre braucht einfache, aber konsequente Gewohnheiten.", forms: ["Privacidade digital depende de hábitos."], tags: ["privacy"] },
    { topic: "tech", cefr: "C1", skill: "question", pt: () => `De que forma a tecnologia afeta sua capacidade de foco?`, deHint: "Wie beeinflusst Technik deine Konzentration?", forms: ["Tecnologia atrapalha o foco?"], tags: ["focus"] },

    { topic: "tech", cefr: "C2", skill: "statement", pt: () => `A automação redefine não apenas tarefas, mas também o sentido de competência.`, deHint: "Automatisierung verändert nicht nur Aufgaben, sondern auch Kompetenzgefühl.", forms: ["Automação muda a noção de competência."], tags: ["abstract"] },
    { topic: "tech", cefr: "C2", skill: "question", pt: () => `Você vê a IA como ampliação humana ou como substituição social?`, deHint: "Siehst du KI als Erweiterung oder als Ersatz?", forms: ["IA amplia ou substitui?"], tags: ["debate"] }
  ]
};