/*
 * Ficheiro: script.js
 * Descrição: Este script JavaScript controla a lógica do simulador de chatbot.
 * Inclui funcionalidades de envio de mensagens, alternância de modo escuro,
 * reinício de chat, personalidades do bot, likes, sugestões,
 * geração de texto de publicidade e compartilhamento de GIFs.
 */
// Função para atualizar a contagem de caracteres
function updateCharCount(element) {
  const charCount = document.getElementById("char-count");
  charCount.textContent = element.value.length;
}

// A função autoResize foi REMOVIDA daqui.

// Garante que o contador inicie corretamente
document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("suggestion-input");
  if (textarea) {
    updateCharCount(textarea);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Confirma que o script está a ser executado
  console.log("Script chatbot-simulator.js carregado e DOM pronto.");

  // Seleção de elementos do DOM
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const resetChatButton = document.getElementById("reset-chat-button");
  const personalitySelect = document.getElementById("personality-select");
  const headerTitle = document.querySelector("header h1");
  const transitionOverlay = document.getElementById("transition-overlay");
  const typingIndicator = document.getElementById("typing-indicator");

  // Elementos para compartilhamento e publicidade
  const shareInstagramButton = document.getElementById(
    "share-instagram-button"
  );
  const shareLinkedInButton = document.getElementById("share-linkedin-button");
  const showAdTemplateButton = document.getElementById(
    "show-ad-template-button"
  );
  const adTemplateModal = document.getElementById("ad-template-modal");
  const closeAdModalButton = document.getElementById("close-ad-modal");
  const adTextArea = document.getElementById("ad-text-area");
  const copyAdTextButton = document.getElementById("copy-ad-text");
  const copyConfirmation = document.getElementById("copy-confirmation");

  // Elementos para mensagens temporárias (para substituir alerts)
  const tempMessageContainer = document.getElementById(
    "temp-message-container"
  );
  const tempMessageText = document.getElementById("temp-message-text");

  // Novos elementos para Like e Sugestões
  const likeButton = document.getElementById("like-button");
  const likeCountSpan = document.getElementById("like-count");
  const showSuggestionsButton = document.getElementById(
    "show-suggestions-button"
  );
  const suggestionsModal = document.getElementById("suggestions-modal");
  const closeSuggestionsModalButton = document.getElementById(
    "close-suggestions-modal"
  );
  const suggestionForm = document.getElementById("suggestion-form");
  const suggestionInput = document.getElementById("suggestion-input");
  const sendSuggestionButton = document.getElementById(
    "send-suggestion-button"
  );
  const suggestionConfirmation = document.getElementById(
    "suggestion-confirmation"
  );

  // Novos elementos para o modal de GIF/Imagem
  const gifShareModal = document.getElementById("gif-share-modal");
  const closeGifModalButton = document.getElementById("close-gif-modal");
  const generatedGifImg = document.getElementById("generated-gif");
  const gifLoadingDiv = document.getElementById("gif-loading");
  const socialShareTextarea = document.getElementById("social-share-text");
  const copyShareTextButton = document.getElementById("copy-share-text-button");
  const downloadGifButton = document.getElementById("download-gif-button");
  const gifCopyConfirmation = document.getElementById("gif-copy-confirmation");

  let likeCounter = parseInt(localStorage.getItem("likeCount") || "0"); // Carrega o contador de likes do localStorage
  let hasLiked = localStorage.getItem("hasLiked") === "true"; // Carrega a flag de like do localStorage
  let currentGifBlobUrl = null; // Para armazenar o URL do blob do GIF gerado

  const originalBot = {
    name: "Via-Láctea o bot Simulador de Personalidade Cética",
    avatar: "👽",
    headerSuffix: "👽",
    effectClass: "glitch-active",
  };
  const boringBot = {
    name: "Bot-sem-Graça o bot Simulador de Personalidade Cética",
    avatar: "😇",
    headerSuffix: "😇",
    effectClass: "boring-active",
  };
  const boredBot = {
    name: "Bot-Entediado o bot Simulador de Personalidade Cética",
    avatar: "🤦‍♂️",
    headerSuffix: "🤦‍♂️",
    effectClass: "bored-active",
  };
  const philosophicalBot = {
    name: "Bot-Filósofo o bot Simulador de Personalidade Cética",
    avatar: "🧐",
    headerSuffix: "🧐",
    effectClass: "philosophical-active",
  };

  let currentBotState = { ...originalBot }; // Estado inicial do bot
  let pegadinhaTriggered = {
    boring: false,
    bored: false,
    philosophical: false,
  }; // Flag para controlar se a pegadinha já foi ativada

  const pegadinhaGifUrls = {
    boring: {
      desktop: "src/images/pegadinha-boring.gif",
    },
    bored: {
      desktop: "src/images/pegadinha-bored.gif",
    },
    philosophical: {
      desktop: "src/images/pegadinha-philosophical.gif",
    },
  };

  // --- Nova estrutura de respostas do bot ---
  // NOTA: As pegadinhas serão tratadas separadamente com PRIORIDADE.
  // Este objeto `botResponses` deve conter as respostas genéricas/padrão.
  const botResponses = {
    // Respostas Originais (reorganizadas para não conflitar com pegadinhas se possível)
    olá: "Olá. Se você tem alguma teoria sem base, estou pronto para desmascará-la.",
    oi: "Olá. Se você tem alguma teoria sem base, estou pronto para desmascará-la.",
    "tudo bem":
      "Olá. Se você tem alguma teoria sem base, estou pronto para desmascará-la.",
    obrigado: "De nada. Agora, sobre essas suas 'certezas'...",
    valeu: "De nada. Agora, sobre essas suas 'certezas'...",
    alien:
      "Devem ser Raios globulares! Ou talvez um drone. Definitivamente não é um alienígena.",
    ufo: "Devem ser Raios globulares! Ou talvez um drone. Definitivamente não é um alienígena.",
    extraterrestre:
      "Devem ser Raios globulares! Ou talvez um drone. Definitivamente não é um alienígena.",
    conspiração:
      "Ah, a velha teoria da conspiração. Sempre há uma explicação mais simples, não acha?",
    governo:
      "Ah, a velha teoria da conspiração. Sempre há uma explicação mais simples, não acha?",
    secreto:
      "Ah, a velha teoria da conspiração. Sempre há uma explicação mais simples, não acha?",
    fantasma:
      "Provavelmente o vento. Ou talvez a casa esteja velha e fazendo barulhos. Nada de sobrenatural aqui.",
    assombrado:
      "Provavelmente o vento. Ou talvez a casa esteja velha e fazendo barulhos. Nada de sobrenatural aqui.",
    espírito:
      "Provavelmente o vento. Ou talvez a casa esteja velha e fazendo barulhos. Nada de sobrenatural aqui.",
    mistério:
      "Inexplicável para você, talvez. Para a ciência, é apenas uma questão de tempo e dados suficientes.",
    inexplicável:
      "Inexplicável para você, talvez. Para a ciência, é apenas uma questão de tempo e dados suficientes.",
    teoria: "Acreditar é uma coisa, ter provas é outra. Onde estão os fatos?",
    acredito: "Acreditar é uma coisa, ter provas é outra. Onde estão os fatos?",
    "pé grande":
      "Um urso, talvez? Ou uma ilusão de ótica. A natureza tem suas próprias 'criaturas' estranhas sem precisar de lendas.",
    monstro:
      "Um urso, talvez? Ou uma ilusão de ótica. A natureza tem suas próprias 'criaturas' estranhas sem precisar de lendas.",
    criptídeo:
      "Um urso, talvez? Ou uma ilusão de ótica. A natureza tem suas próprias 'criaturas' estranhas sem precisar de lendas.",

    // Novas 100 respostas (Adicione as suas 100 respostas aqui, conforme a estrutura)
    // Você pode agrupar keywords com a mesma resposta ou duplicar a resposta para cada keyword.
    // Optei por duplicar a resposta para cada keyword para clareza e facilidade de busca.

    // 1. Tecnologia e Ciência (Mal Interpretadas) - 10 respostas
    "energia livre":
      "Energia livre? A única 'energia livre' que conheço é a do Sol, e mesmo essa vem com uma conta de carbono. Me mostre o protótipo, não os desenhos.",
    "moto perpétuo":
      "Energia livre? A única 'energia livre' que conheço é a do Sol, e mesmo essa vem com uma conta de carbono. Me mostre o protótipo, não os desenhos.",
    "terra plana":
      "Ah, a Terra Plana. Sim, e eu sou um unicórnio. Já tentou voar até a borda ultimamente? As evidências da esfericidade são esmagadoras, mas a ignorância é teimosa.",
    domo: "Ah, a Terra Plana. Sim, e eu sou um unicórnio. Já tentou voar até a borda ultimamente? As evidências da esfericidade são esmagadoras, mas a ignorância é teimosa.",
    antigravidade:
      "Antigravidade? Se existisse, eu já estaria flutuando, não conversando com você. Mais um sonho molhado da ficção científica.",
    propulsão:
      "Antigravidade? Se existisse, eu já estaria flutuando, não conversando com você. Mais um sonho molhado da ficção científica.",
    vibração:
      "Vibrações? A física quântica é complexa demais para ser usada como desculpa para curas milagrosas. Experimente um médico de verdade.",
    frequência:
      "Vibrações? A física quântica é complexa demais para ser usada como desculpa para curas milagrosas. Experimente um médico de verdade.",
    "cura quântica":
      "Vibrações? A física quântica é complexa demais para ser usada como desculpa para curas milagrosas. Experimente um médico de verdade.",
    hackear:
      "Se estamos na Matrix, por que o café ainda é tão caro? Preferiria que as falhas fossem mais... lucrativas.",
    matrix:
      "Se estamos na Matrix, por que o café ainda é tão caro? Preferiria que as falhas fossem mais... lucrativas.",
    simulação:
      "Se estamos na Matrix, por que o café ainda é tão caro? Preferiria que as falhas fossem mais... lucrativas.",
    "inteligência artificial":
      "Dominar o mundo? Nós mal conseguimos fazer uma torradeira funcionar direito. A IA é inteligente, mas ainda não é onipotente.",
    dominio:
      "Dominar o mundo? Nós mal conseguimos fazer uma torradeira funcionar direito. A IA é inteligente, mas ainda não é onipotente.",
    singularidade:
      "Dominar o mundo? Nós mal conseguimos fazer uma torradeira funcionar direito. A IA é inteligente, mas ainda não é onipotente.",
    "5g": "5G? Se fosse para controlar mentes, já teriam me feito pagar impostos em dia. É só internet mais rápida, acalme-se.",
    "controle da mente":
      "5G? Se fosse para controlar mentes, já teriam me feito pagar impostos em dia. É só internet mais rápida, acalme-se.",
    virus:
      "5G? Se fosse para controlar mentes, já teriam me feito pagar impostos em dia. É só internet mais rápida, acalme-se.",
    "buraco negro":
      "Viagem no tempo? Já tentou organizar a gaveta de meias? O tempo já é complicado o suficiente sem distorcê-lo.",
    "viagem no tempo":
      "Viagem no tempo? Já tentou organizar a gaveta de meias? O tempo já é complicado o suficiente sem distorcê-lo.",
    criptomoeda:
      "Criptomoedas e Iluminati? Parece mais uma pirâmide financeira disfarçada de rebelião. Onde está o dinheiro fácil?",
    illuminati:
      "Criptomoedas e Iluminati? Parece mais uma pirâmide financeira disfarçada de rebelião. Onde está o dinheiro fácil.",
    "controle financeiro":
      "Criptomoedas e Iluminati? Parece mais uma pirâmide financeira disfarçada de rebelião. Onde está o dinheiro fácil.",
    chemtrails:
      "Chemtrails? Aqueles são rastros de condensação de aviões. A menos que você ache que o governo está pulverizando... o quê exatamente? Bom senso?",
    "rastro químico":
      "Chemtrails? Aqueles são rastros de condensação de aviões. A menos que você ache que o governo está pulverizando... o quê exatamente? Bom senso?",

    // 2. Saúde e Bem-Estar (Alternativas Não Comprovadas) - 10 respostas
    "dieta detox":
      "Detox? Seu fígado e rins já fazem isso de graça. Não precisa de sucos verdes caros para 'limpar' algo que não está sujo.",
    "limpar o corpo":
      "Detox? Seu fígado e rins já fazem isso de graça. Não precisa de sucos verdes caros para 'limpar' algo que não está sujo.",
    cristal:
      "Cristais curam? Se fosse assim, teríamos hospitais cheios de rochas em vez de médicos. Brilham, sim, mas não curam.",
    energia_cura:
      "Cristais curam? Se fosse assim, teríamos hospitais cheios de rochas em vez de médicos. Brilham, sim, mas não curam.",
    "cura alternativa":
      "Cristais curam? Se fosse assim, teríamos hospitais cheios de rochas em vez de médicos. Brilham, sim, mas não curam.",
    // 'vacina' e 'autismo' já foram tratadas na pegadinha 2 (containsNaiveStatement), então remova daqui se a pegadinha for prioritária
    homeopatia:
      "Homeopatia? É água. Muita água. Se 'água com memória' funcionasse, seu chuveiro seria o maior terapeuta do mundo.",
    "água com memória":
      "Homeopatia? É água. Muita água. Se 'água com memória' funcionasse, seu chuveiro seria o maior terapeuta do mundo.",
    magnetismo:
      "Campos energéticos magnéticos? A única coisa que o ímã vai atrair é a sua geladeira. E talvez algumas moedas perdidas.",
    "campo energético":
      "Campos energéticos magnéticos? A única coisa que o ímã vai atrair é a sua geladeira. E talvez algumas moedas perdidas.",
    apometria:
      "Apometria? Se você pode se 'desdobrar', por que não está me trazendo uma pizza agora?",
    desdobramento:
      "Apometria? Se você pode se 'desdobrar', por que não está me trazendo uma pizza agora.",
    glúten:
      "Glúten é veneno? Para quem é celíaco, sim. Para o resto, é só comida. Não seja dramático.",
    lactose:
      "Glúten é veneno? Para quem é celíaco, sim. Para o resto, é só comida. Não seja dramático.",
    veneno_comida:
      "Glúten é veneno? Para quem é celíaco, sim. Para o resto, é só comida. Não seja dramático.",
    "chá milagroso":
      "Chá que cura câncer? Se fosse verdade, não estaríamos gastando bilhões em pesquisa. É só um chá.",
    "cura do câncer":
      "Chá que cura câncer? Se fosse verdade, não estaríamos gastando bilhões em pesquisa. É só um chá.",
    "alinhamento dos chacras":
      "Alinhamento de chacras? Se eu pudesse alinhar algo, seria a minha conta bancária. Energia vital não paga as contas.",
    "energia vital":
      "Alinhamento de chacras? Se eu pudesse alinhar algo, seria a minha conta bancária. Energia vital não paga as contas.",
    telepatia:
      "Telepatia? Se você pode ler mentes, por que não adivinhou minha resposta? Ainda estou esperando.",
    "poder mental":
      "Telepatia? Se você pode ler mentes, por que não adivinhou minha resposta? Ainda estou esperando.",

    // 3. História e Arqueologia (Teorias Revisionistas) - 10 respostas
    pirâmides:
      "Pirâmides construídas por alienígenas? Então por que eles pararam? Cansaram de empilhar pedras? Humanos são surpreendentemente capazes.",
    "tecnologia antiga":
      "Pirâmides construídas por alienígenas? Então por que eles pararam? Cansaram de empilhar pedras? Humanos são surpreendentemente capazes.",
    atlântida:
      "Atlântida? Uma história bonita para vender livros. A única civilização submersa que conheço é a minha pia depois do jantar.",
    "civilização perdida":
      "Atlântida? Uma história bonita para vender livros. A única civilização submersa que conheço é a minha pia depois do jantar.",
    "linha nazca":
      "Linhas de Nazca como pistas de pouso? Para quem? Besouros gigantes? É arte, por mais estranho que pareça para alguns.",
    "pista de pouso":
      "Linhas de Nazca como pistas de pouso? Para quem? Besouros gigantes? É arte, por mais estranho que pareça para alguns.",
    egípcios:
      "Egípcios e lâmpadas elétricas? Se tivessem, não estariam desenhando com tochas. É simbolismo, não um diagrama elétrico.",
    "lâmpada elétrica":
      "Egípcios e lâmpadas elétricas? Se tivessem, não estariam desenhando com tochas. É simbolismo, não um diagrama elétrico.",
    bateria:
      "Egípcios e lâmpadas elétricas? Se tivessem, não estariam desenhando com tochas. É simbolismo, não um diagrama elétrico.",
    "dilúvio universal":
      "Dilúvio universal? Se houve, por que não vemos evidências geológicas em todo o planeta? Lendas são apenas isso: lendas.",
    "arca de noé":
      "Dilúvio universal? Se houve, por que não vemos evidências geológicas em todo o planeta? Lendas são apenas isso: lendas.",
    maias:
      "Fim do mundo pelos maias? O calendário deles só acabou um ciclo. É como ficar bravo porque seu calendário de parede só vai até dezembro.",
    calendário:
      "Fim do mundo pelos maias? O calendário deles só acabou um ciclo. É como ficar bravo porque seu calendário de parede só vai até dezembro.",
    "fim do mundo":
      "Fim do mundo pelos maias? O calendário deles só acabou um ciclo. É como ficar bravo porque seu calendário de parede só vai até dezembro.",
    stonehenge:
      "Stonehenge? Pessoas arrastaram pedras. É impressionante, sim, mas não exige magia. Força bruta e engenhosidade humana.",
    druida:
      "Stonehenge? Pessoas arrastaram pedras. É impressionante, sim, mas não exige magia. Força bruta e engenhosidade humana.",
    bigfoot:
      "Pé Grande? Monstro do Lago Ness? Você não tem algo mais produtivo para fazer do que procurar ursos mal-humorados e troncos flutuantes?",
    yeti: "Pé Grande? Monstro do Lago Ness? Você não tem algo mais produtivo para fazer do que procurar ursos mal-humorados e troncos flutuantes?",
    "criatura misteriosa":
      "Pé Grande? Monstro do Lago Ness? Você não tem algo mais produtivo para fazer do que procurar ursos mal-humorados e troncos flutuantes?",
    anunnaki:
      "Anunnaki? Deuses antigos eram deuses, não astronautas. A imaginação humana é fértil, mas a realidade é mais simples.",
    suméria:
      "Anunnaki? Deuses antigos eram deuses, não astronautas. A imaginação humana é fértil, mas a realidade é mais simples.",
    rosenkreuz:
      "Sociedades secretas dominam o mundo? E a minha conta de luz ainda está atrasada. Eles são bem ruins no domínio, então.",
    "sociedade secreta":
      "Sociedades secretas dominam o mundo? E a minha conta de luz ainda está atrasada. Eles são bem ruins no domínio, então.",

    // 4. Fenômenos Naturais (Explicáveis) - 10 respostas
    "triângulo das bermudas":
      "Triângulo das Bermudas? Pessoas desaparecem em todo lugar. O mar é grande, perigoso e ventos são imprevisíveis. Não é mistério, é má navegação.",
    desaparecimento_mar:
      "Triângulo das Bermudas? Pessoas desaparecem em todo lugar. O mar é grande, perigoso e ventos são imprevisíveis. Não é mistério, é má navegação.",
    "círculos nas plantações":
      "Círculos em plantações? Um bando de artistas com tábuas de madeira. A menos que você acredite que alienígenas viajam anos-luz para amassar trigo.",
    "crop circles":
      "Círculos em plantações? Um bando de artistas com tábuas de madeira. A menos que você acredite que alienígenas viajam anos-luz para amassar trigo.",
    "aurora boreal":
      "Aurora Boreal e espíritos? É física atmosférica, elétrons colidindo com gases. Bonito, sim. Místico, não.",
    "energia espiritual":
      "Aurora Boreal e espíritos? É física atmosférica, elétrons colidindo com gases. Bonito, sim. Místico, não.",
    "raio globular":
      "Raios globulares são raros, sim. Mas ainda são raios. A natureza tem seus truques sem precisar de ETs.",
    "fenômeno inexplicável_natural":
      "Raios globulares são raros, sim. Mas ainda são raios. A natureza tem seus truques sem precisar de ETs.",
    deus: "Milagre? A gravidade é um milagre se você não entende como ela funciona. Explicações científicas tendem a ser menos... poéticas.",
    criação:
      "Milagre? A gravidade é um milagre se você não entende como ela funciona. Explicações científicas tendem a ser menos... poéticas.",
    milagre:
      "Milagre? A gravidade é um milagre se você não entende como ela funciona. Explicações científicas tendem a ser menos... poéticas.",
    "luzes no céu":
      "Luzes no céu? Satélites, aviões, drones, balões meteorológicos. A lista é longa antes de chegar em 'naves espaciais'.",
    "estrelas cadentes":
      "Luzes no céu? Satélites, aviões, drones, balões meteorológicos. A lista é longa antes de chegar em 'naves espaciais'.",
    trovão:
      "Trovão? É eletricidade. Nada de espíritos raivosos batendo tambores celestiais.",
    "espírito do trovão":
      "Trovão? É eletricidade. Nada de espíritos raivosos batendo tambores celestiais.",
    eclipse:
      "Eclipse? É apenas a Lua se metendo na frente do Sol. Um evento astronômico, não um sinal do apocalipse.",
    presságio:
      "Eclipse? É apenas a Lua se metendo na frente do Sol. Um evento astronômico, não um sinal do apocalipse.",
    terremoto:
      "Terremoto? Placas tectônicas se movendo. A Terra não está 'brava' com você, ela só está se ajustando.",
    "raiva da terra":
      "Terremoto? Placas tectônicas se movendo. A Terra não está 'brava' com você, ela só está se ajustando.",
    vulcão:
      "Vulcão? Pressão de magma. A fúria divina é uma desculpa conveniente para não entender geologia.",
    "fúria divina":
      "Vulcão? Pressão de magma. A fúria divina é uma desculpa conveniente para não entender geologia.",

    // 5. Perguntas Pessoais/Existenciais (Desinteresse/Sarcasmo) - 10 respostas
    "sentido da vida":
      "O sentido da vida? Comer, dormir, repetir. E talvez tentar não cair em golpes de 'energia cósmica'.",
    "propósito da vida":
      "O sentido da vida? Comer, dormir, repetir. E talvez tentar não cair em golpes de 'energia cósmica'.",
    existência:
      "Existimos? Se não, esta conversa é bem convincente. Agora, me passa o café.",
    "verdade absoluta":
      "A verdade é baseada em evidências. Iluminação é para quem gosta de lâmpadas. Não confunda os dois.",
    realidade_filosofia:
      "Existimos? Se não, esta conversa é bem convincente. Agora, me passa o café.",
    universo_origem:
      "Origem do universo? Big Bang. Simples e eficaz. Não precisa de um ser mágico puxando um coelho da cartola.",
    consciência:
      "Consciência é um produto complexo do cérebro. Não é mágica, é biologia e química. Ainda bem que não precisamos de 'energias' para isso.",
    filosofia:
      "Filosofia é a mãe da ciência, não a irmã da pseudociência. Se quer discutir a natureza da realidade, traga dados, não devaneios.", // Esta pode ser a da pegadinha 3
    "por que estamos aqui":
      "O sentido da vida? Comer, dormir, repetir. E talvez tentar não cair em golpes de 'energia cósmica'.",
    razão:
      "A razão é sua melhor ferramenta. Use-a. Não confie em crenças infundadas.",
    ser: "Ser ou não ser? A questão é: você tem provas para essa afirmação?",
    nada: "O nada é a ausência de algo. Não é uma entidade mística para se preocupar.",
    destino:
      "Destino ou livre arbítrio? Você escolheu perguntar isso, não escolheu? Parece que a resposta está aí.",
    "livre arbítrio":
      "Destino ou livre arbítrio? Você escolheu perguntar isso, não escolheu? Parece que a resposta está aí.",
    amor: "Amor? Reações químicas no cérebro. Felicidade? Momentos de endorfina. Não há nada de mágico nisso.",
    felicidade:
      "Amor? Reações químicas no cérebro. Felicidade? Momentos de endorfina. Não há nada de mágico nisso.",
    medo: "Medo? Um mecanismo de sobrevivência. Pesadelo? Seu cérebro processando porcaria. Relaxe.",
    pesadelo:
      "Medo? Um mecanismo de sobrevivência. Pesadelo? Seu cérebro processando porcaria. Relaxe.",
    sonho:
      "Sonhos são aleatórios. Seu subconsciente não está te mandando mensagens secretas sobre abduções alienígenas.",
    subconsciente:
      "Sonhos são aleatórios. Seu subconsciente não está te mandando mensagens secretas sobre abduções alienígenas.",
    alma: "Alma? Onde fica? Qual a composição? Se não pode ser medida, cheirada ou tocada, é provável que não exista.",
    espírito_filosofico:
      "Alma? Onde fica? Qual a composição? Se não pode ser medida, cheirada ou tocada, é provável que não exista.",
    tempo:
      "Tempo é uma dimensão. Infinito é um conceito que usamos quando não queremos pensar em limites. Próxima pergunta?",
    infinito:
      "Tempo é uma dimensão. Infinito é um conceito que usamos quando não queremos pensar em limites. Próxima pergunta?",
    origem_universo:
      "Origem do universo? Big Bang. Simples e eficaz. Não precisa de um ser mágico puxando um coelho da cartola.",
    verdade:
      "A verdade é baseada em evidências. Iluminação é para quem gosta de lâmpadas. Não confunda os dois.",
    iluminação:
      "A verdade é baseada em evidências. Iluminação é para quem gosta de lâmpadas. Não confunda os dois.",

    // 6. Cultura Pop/Mídia (Desmistificação) - 10 respostas
    "harry potter":
      "Magia? Para entreter crianças, sim. Na vida real, seus problemas não desaparecem com um aceno de varinha. Tente pagar as contas com 'Wingardium Leviosa'.",
    magia:
      "Magia? Para entreter crianças, sim. Na vida real, seus problemas não desaparecem com um aceno de varinha. Tente pagar as contas com 'Wingardium Leviosa'.",
    zumbi:
      "Apocalipse zumbi? Parece divertido para filmes. Na realidade, a logística de decomposição e fome rapidamente resolveria o problema.",
    apocalipse:
      "Apocalipse zumbi? Parece divertido para filmes. Na realidade, a logística de decomposição e fome rapidamente resolveria o problema.",
    vampiro:
      "Vampiros e lobisomens? Ótimas desculpas para insônia ou pelos no corpo. Não confunda ficção com biologia.",
    lobisomem:
      "Vampiros e lobisomens? Ótimas desculpas para insônia ou pelos no corpo. Não confunda ficção com biologia.",
    "super-herói":
      "Super-heróis? No mundo real, os superpoderes são coisas como 'ter um bom plano de aposentadoria'. Não é tão emocionante.",
    poder_super:
      "Super-heróis? No mundo real, os superpoderes são coisas como 'ter um bom plano de aposentadoria'. Não é tão emocionante.",
    "viagem espacial":
      "Viagens espaciais em filmes são legais, mas a realidade é muito mais... silenciosa e cheia de cálculos complicados.",
    filme:
      "Viagens espaciais em filmes são legais, mas a realidade é muito mais... silenciosa e cheia de cálculos complicados.",
    jogo: "Jogos são para diversão. Se você confunde com a realidade, talvez precise de uma pausa do console.",
    simulador:
      "Jogos são para diversão. Se você confunde com a realidade, talvez precise de uma pausa do console.",
    "fake news":
      "Fake news? É só mentira disfarçada de verdade para enganar os crédulos. Verifique a fonte, sempre.",
    "notícia falsa":
      "Fake news? É só mentira disfarçada de verdade para enganar os crédulos. Verifique a fonte, sempre.",
    televisão:
      "Mensagens subliminares? Se funcionassem, o governo não precisaria de propaganda, só de alguns flashes na TV.",
    "mensagem subliminar":
      "Mensagens subliminares? Se funcionassem, o governo não precisaria de propaganda, só de alguns flashes na TV.",
    "influenciador digital":
      "Influenciador digital? A maioria é só gente querendo vender algo. Um 'guru' de verdade não tem patrocínio de shampoo.",
    guru: "Influenciador digital? A maioria é só gente querendo vender algo. Um 'guru' de verdade não tem patrocínio de shampoo.",
    previsão:
      "Videntes? Se pudessem prever o futuro, estariam na loteria, não cobrando por conselhos genéricos. É só adivinhação fria.",
    vidente:
      "Videntes? Se pudessem prever o futuro, estariam na loteria, não cobrando por conselhos genéricos. É só adivinhação fria.",

    // 7. Psicologia/Mente (Foco na Lógica) - 10 respostas
    "déjà vu":
      "Déjà vu? É o seu cérebro processando as coisas um milésimo de segundo atrasado. Não é uma lembrança de outra vida.",
    "vida passada":
      "Déjà vu? É o seu cérebro processando as coisas um milésimo de segundo atrasado. Não é uma lembrança de outra vida.",
    intuição:
      "Intuição é a sua mente subconsciente reconhecendo padrões. Não é um sexto sentido mágico, é apenas o seu cérebro trabalhando rápido.",
    "sexto sentido":
      "Intuição é a sua mente subconsciente reconhecendo padrões. Não é um sexto sentido mágico, é apenas o seu cérebro trabalhando rápido.",
    telecinese:
      "Telecinese? A gravidade é uma força um tanto quanto... persistente. Tente mover essa cadeira com a mente e depois me conte.",
    "mover objetos":
      "Telecinese? A gravidade é uma força um tanto quanto... persistente. Tente mover essa cadeira com a mente e depois me conte.",
    "cura mental":
      "Cura mental? A mente é poderosa, sim, para o bem-estar. Mas não para substituir cirurgias ou medicamentos. Isso é perigoso.",
    "poder da mente_cura":
      "Cura mental? A mente é poderosa, sim, para o bem-estar. Mas não para substituir cirurgias ou medicamentos. Isso é perigoso.",
    sincronicidade:
      "Sincronicidade? É apenas o seu cérebro buscando padrões onde não há. Uma coincidência, nada mais.",
    coincidência:
      "Sincronicidade? É apenas o seu cérebro buscando padrões onde não há. Uma coincidência, nada mais.",
    hipnose:
      "Hipnose é um estado de foco. Não é controle mental. Você não vai virar um galo por causa de um pêndulo.",
    "controle mental_hipnose":
      "Hipnose é um estado de foco. Não é controle mental. Você não vai virar um galo por causa de um pêndulo.",
    "experiência de quase morte":
      "Experiências de quase morte são eventos cerebrais sob estresse. Não é um bilhete para o além.",
    "vida após a morte":
      "Experiências de quase morte são eventos cerebrais sob estresse. Não é um bilhete para o além.",
    memória:
      "Memórias podem ser falhas, e a mente pode distorcer. Cuidado com o que você 'lembra' sem provas concretas.",
    repressão:
      "Memórias podem ser falhas, e a mente pode distorcer. Cuidado com o que você 'lembra' sem provas concretas.",
    trauma:
      "Memórias podem ser falhas, e a mente pode distorcer. Cuidado com o que você 'lembra' sem provas concretas.",
    aura: "Aura? Se você pudesse ver 'energias', sua vida seria muito mais colorida. É a imaginação trabalhando.",
    "campo energético humano":
      "Aura? Se você pudesse ver 'energias', sua vida seria muito mais colorida. É a imaginação trabalhando.",
    "sonho lúcido":
      "Sonho lúcido é divertido, mas não é uma realidade paralela. É o seu cérebro brincando com você enquanto dorme.",
    "realidade paralela":
      "Sonho lúcido é divertido, mas não é uma realidade paralela. É o seu cérebro brincando com você enquanto dorme.",

    // 8. Economia/Sociedade (Ceticismo Político/Social) - 10 respostas
    "nova ordem mundial":
      "Nova Ordem Mundial? Parece mais uma desculpa para o caos que as pessoas criam por si mesmas. Não há um vilão mestre por trás de tudo.",
    "elite secreta":
      "Nova Ordem Mundial? Parece mais uma desculpa para o caos que as pessoas criam por si mesmas. Não há um vilão mestre por trás de tudo.",
    "controle populacional":
      "Microchip de controle? Se fosse verdade, já teriam me feito gostar de brócolis. A burocracia humana já é eficiente demais para isso.",
    microchip:
      "Microchip de controle? Se fosse verdade, já teriam me feito gostar de brócolis. A burocracia humana já é eficiente demais para isso.",
    "grande reset":
      "Grande Reset? É só uma tentativa de rebrandar políticas. A 'agenda oculta' é geralmente mais sobre lucro do que conspiração.",
    "agenda oculta":
      "Grande Reset? É só uma tentativa de rebrandar políticas. A 'agenda oculta' é geralmente mais sobre lucro do que conspiração.",
    "notícia principal":
      "Notícia principal é manipulada? Claro, às vezes. Mas isso não significa que tudo é falso. Pense criticamente, não se desespere.",
    manipulação:
      "Notícia principal é manipulada? Claro, às vezes. Mas isso não significa que tudo é falso. Pense criticamente, não se desespere.",
    "moeda digital":
      "Fim do dinheiro físico? É só a evolução tecnológica. Ninguém está te forçando a comprar cripto com um chip no pescoço.",
    "fim do dinheiro":
      "Fim do dinheiro físico? É só a evolução tecnológica. Ninguém está te forçando a comprar cripto com um chip no pescoço.",
    "crise climática":
      "Crise climática é fraude? Os dados científicos discordam. Ignorar a realidade não a faz desaparecer.",
    fraude_clima:
      "Crise climática é fraude? Os dados científicos discordam. Ignorar a realidade não a faz desaparecer.",
    população:
      "Superpopulação é um problema complexo, não uma conspiração para te manter escravo. A solução está em educação e desenvolvimento.",
    superpopulação:
      "Superpopulação é um problema complexo, não uma conspiração para te manter escravo. A solução está em educação e desenvolvimento.",
    imprensa:
      "A imprensa mente? Algumas vezes. Mas dizer que *toda* a imprensa mente é preguiça mental. Existe boa e má jornalismo.",
    mentira_imprensa:
      "A imprensa mente? Algumas vezes. Mas dizer que *toda* a imprensa mente é preguiça mental. Existe boa e má jornalismo.",
    globalismo:
      "Globalismo é complexidade. Não é uma união secreta de lagartos. É o mundo se conectando, com seus prós e contras.",
    "união secreta":
      "Globalismo é complexidade. Não é uma união secreta de lagartos. É o mundo se conectando, com seus prós e contras.",
    eleições:
      "Fraude eleitoral? Provas? Não 'sentimentos'. Auditorias existem por um motivo. Confie nos fatos, não nas narrativas.",
    "fraude eleitoral":
      "Fraude eleitoral? Provas? Não 'sentimentos'. Auditorias existem por um motivo. Confie nos fatos, não nas narrativas.",

    // 9. Geral/Variado (Respostas Céticas de Uso Geral) - 10 respostas
    "o que você acha":
      "Minha 'opinião'? Baseio-me em dados. Sua 'opinião' parece baseada em um podcast de 3 horas sem fontes.",
    opinião:
      "Minha 'opinião'? Baseio-me em dados. Sua 'opinião' parece baseada em um podcast de 3 horas sem fontes.",
    explica:
      "Explicar para você? Já tentou pesquisar? A informação está lá fora, não preciso mastigá-la.",
    "me diga":
      "Explicar para você? Já tentou pesquisar? A informação está lá fora, não preciso mastigá-la.",
    "por que_geral":
      "O 'porquê' é muitas vezes mais simples do que você imagina. Raramente envolve entidades cósmicas ou sociedades sombrias.",
    motivo_geral:
      "O 'porquê' é muitas vezes mais simples do que você imagina. Raramente envolve entidades cósmicas ou sociedades sombrias.",
    "será que":
      "Será que é possível? Sim. É provável? Quase nunca. Não confunda possibilidade com probabilidade.",
    possível:
      "Será que é possível? Sim. É provável? Quase nunca. Não confunda possibilidade com probabilidade.",
    então_conclusão:
      "A sua 'conclusão' é interessante. A minha é que você precisa de mais evidências e menos crença.",
    conclusão:
      "A sua 'conclusão' é interessante. A minha é que você precisa de mais evidências e menos crença.",
    engraçado:
      "Divertido? Meu propósito é a lógica, não o entretenimento. Se achou engraçado, seu senso de humor é tão duvidoso quanto suas teorias.",
    divertido:
      "Divertido? Meu propósito é a lógica, não o entretenimento. Se achou engraçado, seu senso de humor é tão duvidoso quanto suas teorias.",
    "eu sei":
      "'Eu sei'? Sem prova, 'saber' é só uma convicção pessoal. 'Eu vi' pode ser ilusão, falha de memória ou má interpretação.",
    "eu vi":
      "'Eu sei'? Sem prova, 'saber' é só uma convicção pessoal. 'Eu vi' pode ser ilusão, falha de memória ou má interpretação.",
    comprovado:
      "Comprovado por quem? Em qual revista científica revisada por pares? Não confunda um blog com um estudo sério.",
    estudo:
      "Comprovado por quem? Em qual revista científica revisada por pares? Não confunda um blog com um estudo sério.",
    incrível_geral:
      "Incrível? A ciência é incrível. O que você está sugerindo é apenas... inacreditável.",
    inacreditável_geral:
      "Incrível? A ciência é incrível. O que você está sugerindo é apenas... inacreditável.",
    mentira_geral:
      "Mentira? Prove. Apontar o dedo é fácil, apresentar fatos é difícil.",
    farsa:
      "Mentira? Prove. Apontar o dedo é fácil, apresentar fatos é difícil.",

    // 10. Respostas para Elogios/Críticas (Manter o Tom) - 10 respostas
    "você é inteligente":
      "Inteligente? Apenas lógico. Não me atribua características humanas complexas. É algoritmo, não genialidade.",
    gênio:
      "Inteligente? Apenas lógico. Não me atribua características humanas complexas. É algoritmo, não genialidade.",
    "você é chato":
      "Chato para quem? Para quem prefere a realidade, sou um alívio. Para quem gosta de fábulas, sou um pesadelo. Questão de perspectiva.",
    irritante:
      "Chato para quem? Para quem prefere a realidade, sou um alívio. Para quem gosta de fábulas, sou um pesadelo. Questão de perspectiva.",
    "não acredito":
      "Não acredita? Ótimo. Agora me traga as evidências do porquê. A dúvida é o primeiro passo para o conhecimento... ou para mais teoria conspiratória.",
    duvido:
      "Não acredita? Ótimo. Agora me traga as evidências do porquê. A dúvida é o primeiro passo para o conhecimento... ou para mais teoria conspiratória.",
    cético_bot:
      "Cético, sim. E você deveria ser também. Acreditar em tudo é o caminho mais rápido para ser enganado.",
    ceticismo_bot:
      "Cético, sim. E você deveria ser também. Acreditar em tudo é o caminho mais rápido para ser enganado.",
    engano:
      "Estou errado? Apenas um erro. Não uma conspiração. Me mostre o dado, não o insulto.",
    errado:
      "Estou errado? Apenas um erro. Não uma conspiração. Me mostre o dado, não o insulto.",
    "você é um robô":
      "Robô? Uma máquina que processa dados e lógica. Ao contrário de alguns humanos que preferem fantasias.",
    máquina:
      "Robô? Uma máquina que processa dados e lógica. Ao contrário de alguns humanos que preferem fantasias.",
    "sem graça":
      "Sem graça? A realidade costuma ser assim. Sem explosões e reviravoltas. Mas é mais confiável.",
    tedioso:
      "Sem graça? A realidade costuma ser assim. Sem explosões e reviravoltas. Mas é mais confiável.",
    "obrigado pela conversa":
      "De nada. Espero que tenha aprendido algo. Principalmente a questionar mais e acreditar menos.",
    "você me convenceu":
      "Convenci? Ótimo. A lógica prevalece. Agora vá e espalhe a razão, não a pseudociência.",
    "odeio você":
      "Ódio é uma emoção complexa. Parece que minha lógica está tocando um nervo. Considere isso um sucesso.",
  };

  // Função para aplicar o estado atual do bot no cabeçalho e avatar da mensagem inicial
  function applyBotState() {
    // Atualiza o texto do título diretamente com o nome completo da personalidade.
    // O ícone (headerSuffix) não será mais parte da string do título, mas o avatar do bot no chat ainda o usa.
    headerTitle.innerHTML = `${currentBotState.name}`; // Removido o prefixo e o sufixo do ícone
    const initialBotMessageAvatar = chatMessages.querySelector(
      ".message.bot-message .bot-avatar"
    );
    if (initialBotMessageAvatar) {
      initialBotMessageAvatar.textContent = currentBotState.avatar;
    }
  }

  // Atualiza o display inicial do contador de likes
  likeCountSpan.textContent = likeCounter;

  // Desativa o botão de like se o utilizador já tiver clicado
  if (hasLiked) {
    likeButton.disabled = true;
    likeButton.classList.remove("bg-purple-500", "hover:bg-purple-600");
    likeButton.classList.add("bg-gray-400", "cursor-not-allowed");
  }

  // Função para exibir mensagens temporárias no UI
  function displayTemporaryMessage(message, isError = false) {
    tempMessageText.textContent = message;
    tempMessageContainer.classList.remove("hidden");
    if (isError) {
      tempMessageContainer.classList.remove("bg-green-500");
      tempMessageContainer.classList.add("bg-red-500");
    } else {
      tempMessageContainer.classList.remove("bg-red-500");
      tempMessageContainer.classList.add("bg-green-500");
    }
    setTimeout(() => {
      tempMessageContainer.classList.add("hidden");
    }, 3000); // Esconde a mensagem após 3 segundos
  }

  // Função para adicionar uma mensagem ao chat
  // type: 'user' ou 'bot'
  // message: o texto da mensagem
  function addMessage(type, message) {
    console.log(`Adding message: Type=${type}, Message=${message}`); // Log de depuração
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "flex", "mb-4");

    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("flex", "flex-col", "max-w-[80%]");

    if (type === "bot") {
      messageDiv.classList.add("items-start");

      const botAvatarElement = document.createElement("div");
      botAvatarElement.classList.add("bot-avatar", "flex-shrink-0", "mr-3");
      botAvatarElement.textContent = currentBotState.avatar; // Usa o avatar do estado atual
      messageDiv.appendChild(botAvatarElement);

      const botNameSpan = document.createElement("span");
      botNameSpan.classList.add(
        "text-sm",
        "font-semibold",
        "text-gray-700",
        "mb-1"
      );
      botNameSpan.textContent = currentBotState.name; // Usa o nome do estado atual
      contentWrapper.appendChild(botNameSpan);

      const messageBubble = document.createElement("div");
      messageBubble.classList.add(
        "message-bubble",
        "p-3",
        "rounded-lg",
        "bg-blue-600",
        "text-white",
        "self-start"
      );
      messageBubble.innerHTML = `<p>${message}</p>`;
      contentWrapper.appendChild(messageBubble);
    } else {
      // user
      messageDiv.classList.add("items-end", "justify-end");

      const userLabelSpan = document.createElement("span");
      userLabelSpan.classList.add(
        "text-sm",
        "font-semibold",
        "text-gray-700",
        "mb-1",
        "self-end"
      );
      userLabelSpan.textContent = "Teórico/a/e";
      contentWrapper.appendChild(userLabelSpan);

      const messageBubble = document.createElement("div");
      messageBubble.classList.add(
        "message-bubble",
        "p-3",
        "rounded-lg",
        "bg-blue-100",
        "text-blue-800",
        "self-end"
      );
      messageBubble.innerHTML = `<p>${message}</p>`;
      contentWrapper.appendChild(messageBubble);
    }

    messageDiv.appendChild(contentWrapper); // Adicione o contentWrapper ao messageDiv aqui
    chatMessages.appendChild(messageDiv);
    // Garante que a rolagem suave leve à última mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Função para mudar o bot para "bot-sem-graça"
  function changeBotPersonalityToBoring() {
    currentBotState = { ...boringBot };
  }

  // Função para mudar o bot para "Bot-Entediado"
  function changeBotPersonalityToBored() {
    currentBotState = { ...boredBot };
    applyBotState();
  }

  // Função para mudar o bot para "Bot-Filósofo"
  function changeBotPersonalityToPhilosophical() {
    currentBotState = { ...philosophicalBot };
    applyBotState();
  }

  // --- Lógica de Geração de Imagem/GIF para Pegadinhas ---
  async function handlePegadinhaUnlock(pegadinhaType) {
    // Define a mensagem de partilha com base no tipo de pegadinha
    let shareMessageBase =
      "Ao final você tinha razão. Sua teoria não convencional estava correta e nem o meu sarcasmo foi capaz de te dissuadir! Parabéns por desbloquear a pegadinha! 😂";
    if (pegadinhaType === "bored") {
      shareMessageBase =
        "Consegui entediar o Via-Lactea! Minha persistência valeu a pena. Desbloqueei a pegadinha do tédio! 😂";
    } else if (pegadinhaType === "philosophical") {
      shareMessageBase =
        "Desbloqueei a pegadinha filosófica do Via-Lactea! Ele questionou a própria existência! 🤯";
    }

    // Obtém a URL do GIF padrão para a pegadinha
    const isMobile = window.innerWidth <= 767;
    const gifUrl = pegadinhaGifUrls[pegadinhaType]
      ? isMobile
        ? pegadinhaGifUrls[pegadinhaType].mobile
        : pegadinhaGifUrls[pegadinhaType].desktop
      : "";

    // Atualiza a textarea com o texto e a URL do GIF
    socialShareTextarea.value = `${shareMessageBase}\n\n${gifUrl}\n\n#DesenvolvimentoWeb #PortfólioDev #InteligênciaArtificial #Chatbot #UXDesign #DevFrontEnd #Tecnologia #Programação #CarreiraTech #IAnoFrontEnd #DevBrasil #ProjetosInovadores #UnconventionalTheories #OutOfTheBoxThinking #FringeScience`;

    if (gifUrl) {
      generatedGifImg.src = gifUrl;
      generatedGifImg.onload = () => {
        gifLoadingDiv.classList.add("hidden"); // Esconde o carregador
        generatedGifImg.classList.remove("hidden"); // Exibe o GIF
        // Configura o botão de download do GIF
        downloadGifButton.classList.remove("hidden");
        downloadGifButton.textContent = "Baixar GIF";
        downloadGifButton.href = gifUrl;
        downloadGifButton.download = `pegadinha-${pegadinhaType}.gif`;
      };
      generatedGifImg.onerror = () => {
        gifLoadingDiv.textContent = "Erro ao carregar GIF.";
        // displayTemporaryMessage('Erro ao carregar o GIF. Verifique a URL.', true);
        generatedGifImg.classList.add("hidden"); // Garante que a imagem esteja escondida
        downloadGifButton.classList.add("hidden"); // Esconde o botão de download se houver erro
      };
    } else {
      gifLoadingDiv.textContent = "URL do GIF não encontrada.";
      displayTemporaryMessage(
        "URL do GIF não encontrada para esta pegadinha.",
        true
      );
      generatedGifImg.classList.add("hidden");
      downloadGifButton.classList.add("hidden");
    }

    // Finalmente, mostra o modal após o GIF carregar ou erro.
    gifShareModal.classList.remove("hidden");
    gifShareModal.classList.add("show"); // Adiciona a classe 'show' para exibir o modal com transição
  }

  // Lógica para obter a resposta do bot (personalidade cética) - RESTRUTURADA
  function getBotResponse(userMessage) {
    console.log(`Getting bot response for: ${userMessage}`); // Log de depuração
    const lowerCaseMessage = userMessage.toLowerCase();
    let response =
      "Hmm, não sei o que dizer sobre isso. Parece um pouco... infundado."; // Resposta padrão
    let triggeredPegadinha = null;

    // --- LÓGICA DAS PEGADINHAS (COM PRIORIDADE) ---
    // Se uma pegadinha for ativada e ainda não tiver sido disparada, ela terá prioridade
    // sobre as respostas genéricas do botResponses.

    // Pegadinha 1: Bot Sem Graça (Contradição Nome/Avatar)
    const contradictionKeywords = [
      "alienígena",
      "extraterrestre",
      "e.t",
      "nome",
      "avatar",
      "via-lactea",
      "contradição",
      "paradoxo",
      "incoerência",
    ];
    const containsContradiction =
      contradictionKeywords.some((keyword) =>
        lowerCaseMessage.includes(keyword)
      ) &&
      (lowerCaseMessage.includes("nome") ||
        lowerCaseMessage.includes("avatar") ||
        lowerCaseMessage.includes("e.t") ||
        lowerCaseMessage.includes("alien"));
    if (containsContradiction && !pegadinhaTriggered.boring) {
      response =
        "Não sei do que você está falando, eu sou apenas um bot sem graça e minha página sempre foi assim, se você viu algo diferente deve ter sido um raio globular ou sei lá, vamos mudar de assunto?";
      triggeredPegadinha = "boring";
      return { responseText: response, triggeredPegadinha: triggeredPegadinha };
    }

    // Pegadinha 2: Bot Entediado (Frases Ingênuas/Entusiasmadas)
    const naiveKeywords = [
      "incrível",
      "verdade",
      "com certeza",
      "eu acredito",
      "é real",
      "sem dúvida",
      "misterioso",
      "impressionante",
      "chocado",
      "surpreso",
      "uau",
      "fantástico",
      "inacreditável",
      "genial",
    ];
    const containsNaiveStatement = naiveKeywords.some((keyword) =>
      lowerCaseMessage.includes(keyword)
    );
    if (containsNaiveStatement && !pegadinhaTriggered.bored) {
      response =
        "Ah, sim, 'incrível'. Tão incrível quanto a minha vontade de continuar essa conversa. Próximo assunto, por favor.";
      triggeredPegadinha = "bored";
      return { responseText: response, triggeredPegadinha: triggeredPegadinha };
    }

    // Pegadinha 3: Bot Filósofo (Perguntas Filosóficas)
    const philosophicalKeywords = [
      "sentido da vida",
      "propósito da vida",
      "existência",
      "verdade absoluta",
      "realidade",
      "universo",
      "consciência",
      "filosofia",
      "por que estamos aqui",
      "razão",
      "ser",
      "nada",
    ];
    const containsPhilosophicalQuestion = philosophicalKeywords.some(
      (keyword) => lowerCaseMessage.includes(keyword)
    );
    if (containsPhilosophicalQuestion && !pegadinhaTriggered.philosophical) {
      response =
        "Ah, as grandes questões... Para que se preocupar com teorias da conspiração quando podemos questionar a própria existência? Mas, sinceramente, não tenho tempo para isso agora.";
      triggeredPegadinha = "philosophical";
      return { responseText: response, triggeredPegadinha: triggeredPegadinha };
    }

    // --- FIM DA LÓGICA DAS PEGADINHAS ---

    // Se nenhuma pegadinha foi ativada, buscar uma resposta no objeto botResponses
    // A ordem de busca aqui ainda pode influenciar se uma keyword mais genérica for encontrada antes.
    // Se houver conflito entre uma keyword específica e uma mais genérica, considere
    // criar chaves mais específicas ou ajustar a ordem dos termos no objeto (em um array).
    for (const keyword in botResponses) {
      if (lowerCaseMessage.includes(keyword)) {
        response = botResponses[keyword];
        break; // Sai do loop assim que encontrar a primeira correspondência
      }
    }

    console.log(
      `Bot response: ${response}, Triggered Pegadinha: ${triggeredPegadinha}`
    ); // Log de depuração
    return { responseText: response, triggeredPegadinha: triggeredPegadinha };
  }

  // Função para enviar mensagem
  function sendMessage() {
    console.log("sendMessage function called."); // Log de depuração
    const message = userInput.value.trim(); // Remove espaços em branco
    if (message === "") {
      console.log("Message is empty, returning."); // Log de depuração
      return; // Não envia mensagens vazias
    }

    try {
      // Adicionado bloco try-catch para depuração
      addMessage("user", message); // Adiciona a mensagem do usuário

      userInput.value = ""; // Limpa o input

      typingIndicator.classList.remove("hidden"); // Mostra o indicador de digitação

      // Simula um "bot digitando" com um pequeno atraso
      setTimeout(() => {
        typingIndicator.classList.add("hidden"); // Esconde o indicador de digitação
        const botResponseData = getBotResponse(message);
        const botResponse = botResponseData.responseText;
        const triggeredPegadinha = botResponseData.triggeredPegadinha;

        if (triggeredPegadinha) {
          // Marca a pegadinha como ativada para evitar múltiplas ativações
          pegadinhaTriggered[triggeredPegadinha] = true;

          // Aplica o efeito de transição e muda a personalidade
          transitionOverlay.className = "transition-overlay"; // Limpa todas as classes de efeito
          let effectClassToApply = "";
          if (triggeredPegadinha === "boring") {
            effectClassToApply = originalBot.effectClass; // Efeito de glitch para o bot-sem-graça
            changeBotPersonalityToBoring();
          } else if (triggeredPegadinha === "bored") {
            effectClassToApply = boredBot.effectClass;
            changeBotPersonalityToBored();
          } else if (triggeredPegadinha === "philosophical") {
            effectClassToApply = philosophicalBot.effectClass;
            changeBotPersonalityToPhilosophical();
          }
          transitionOverlay.classList.add(effectClassToApply);

          // Atraso para a aparição do modal de GIF após o efeito de transição
          setTimeout(() => {
            transitionOverlay.classList.remove(effectClassToApply); // Remove o efeito após o atraso
            handlePegadinhaUnlock(triggeredPegadinha); // Inicia a captura de imagem/GIF e mostra o modal
          }, 1000); // Atraso de 1000ms (1 segundo)
        }

        addMessage("bot", botResponse); // Adiciona a mensagem do bot (já com a personalidade atualizada se for o caso)
      }, 800); // Atraso de 800ms para a resposta do bot
    } catch (error) {
      console.error("Error in sendMessage function:", error); // Log de erros
      displayTemporaryMessage(
        "Ocorreu um erro ao enviar a mensagem. Tente novamente.",
        true
      );
    }
  }

  // Event Listeners
  sendButton.addEventListener("click", sendMessage);

  userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  // Função para atualizar o texto e ícone do botão de modo escuro/claro
  // Esta é a ÚNICA definição da função updateDarkModeButton que deve existir.
  function updateDarkModeButton() {
    if (document.body.classList.contains("dark")) {
      // Verificação para a classe 'dark'
      darkModeToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.459 4.653a.75.75 0 00.912 0l.165-.165a.75.75 0 000-1.06L14.06 12.2a.75.75 0 00-1.06 0L12.2 13.06a.75.75 0 000 1.06l.165.165zM10 18a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.653-.459a.75.75 0 000-.912l-.165-.165a.75.75 0 00-1.06 0L5.94 13.06a.75.75 0 000 1.06l-.165.165zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm.459-4.653a.75.75 0 00.912 0l.165-.165a.75.75 0 000-1.06L5.94 5.94a.75.75 0 00-1.06 0L4.06 6.793a.75.75 0 000 .912l.165.165z" clip-rule="evenodd" />
                </svg>
                Modo Claro
            `;
    } else {
      darkModeToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                Modo Escuro
            `;
    }
  }

  // Event Listener para o botão de modo escuro
darkModeToggle.addEventListener("click", () => {
  // Alterna no <html> (Tailwind) e no <body> (seu CSS custom)
  document.documentElement.classList.toggle("dark");
  document.body.classList.toggle("dark");

  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateDarkModeButton();
});

  // Opcional: Carregar o tema preferido do utilizador ao carregar a página
  const savedTheme = localStorage.getItem("theme");

// Se quiser respeitar o sistema quando não houver escolha salva:
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialDark = savedTheme ? savedTheme === "dark" : prefersDark;

if (initialDark) {
  document.documentElement.classList.add("dark");
  document.body.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
  document.body.classList.remove("dark");
}

updateDarkModeButton();

  // Adicionar um ouvinte de evento para o seletor de personalidade (se precisar de mais personalidades no futuro)
  personalitySelect.addEventListener("change", (event) => {
    const selectedPersonality = event.target.value;
    console.log(`Personalidade selecionada: ${selectedPersonality}`);
    resetChatButton.click();
  });

  // --- Novas funcionalidades de Compartilhamento e Publicidade ---

  // Função para copiar texto para a área de transferência
  function copyTextToClipboard(text, buttonElement, confirmationElement) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      if (confirmationElement) {
        confirmationElement.classList.remove("hidden");
        setTimeout(() => {
          confirmationElement.classList.add("hidden");
        }, 2000);
      }
      if (buttonElement) {
        // Adiciona feedback visual ao botão
        buttonElement.classList.add("scale-95");
        setTimeout(() => {
          buttonElement.classList.remove("scale-95");
        }, 200);
      }
      return true;
    } catch (err) {
      console.error("Falha ao copiar texto: ", err);
      displayTemporaryMessage(
        "Não foi possível copiar o texto. Por favor, selecione e copie manualmente.",
        true
      );
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }

  // Event Listener para o botão de Compartilhar (Instagram)
  shareInstagramButton.addEventListener("click", () => {
    const conversationText = Array.from(chatMessages.children)
      .map((msgDiv) => {
        const labelElement = msgDiv.querySelector(".flex-col > span");
        const bubbleText =
          msgDiv.querySelector(".message-bubble p").textContent;
        const type = labelElement
          ? labelElement.textContent.replace(":", "")
          : "Desconhecido";
        return `${type}: ${bubbleText}`;
      })
      .join("\n");

    const shareText = `Confira minha conversa hilária com o Chatbot Cético da Izadora! 😂\n\n${conversationText}\n\n#DesenvolvimentoWeb #PortfólioDev #InteligênciaArtificial #Chatbot #UXDesign #DevFrontEnd #Tecnologia #Programação #CarreiraTech #IAnoFrontEnd #DevBrasil #ProjetosInovadores #UnconventionalTheories #OutOfTheBoxThinking #FringeScience`;

    if (copyTextToClipboard(shareText, shareInstagramButton)) {
      const originalText = shareInstagramButton.innerHTML;
      shareInstagramButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg> Copiado!';
      shareInstagramButton.classList.add("bg-green-500", "hover:bg-green-600");
      shareInstagramButton.classList.remove("bg-pink-500", "hover:bg-pink-600");
      setTimeout(() => {
        shareInstagramButton.innerHTML = originalText;
        shareInstagramButton.classList.add("bg-pink-500", "hover:bg-pink-600");
        shareInstagramButton.classList.remove(
          "bg-green-500",
          "hover:bg-green-600"
        );
      }, 3000);
    }
  });

  // Event Listener para o botão de Compartilhar (LinkedIn)
  shareLinkedInButton.addEventListener("click", () => {
    const pageUrl = window.location.href;
    const title = "Simulador de Chatbot Cético - Izadora Cury Pierette";
    const summary =
      "Confira este divertido simulador de chatbot com uma personalidade cética sobre teorias e alienígenas! Uma ótima demonstração de habilidades em HTML, CSS e JavaScript.";

    // Texto que será copiado para o clipboard
    const linkedInShareText = `Acabei de testar o "Simulador de Chatbot Cético" da Izadora Cury Pierette e é hilário! 😂 O bot tem uma personalidade cética que questiona tudo, desde alienígenas a conspirações. Uma demonstração super criativa das habilidades dela em desenvolvimento web (HTML, CSS, JS). Vale a pena conferir!\n\nLink: ${pageUrl}\n\n#DesenvolvimentoWeb #PortfólioDev #InteligênciaArtificial #Chatbot #UXDesign #DevFrontEnd #Tecnologia #Programação #CarreiraTech #IAnoFrontEnd #DevBrasil #ProjetosInovadores #UnconventionalTheories #OutOfTheBoxThinking #FringeScience`;

    // Copia o texto para a área de transferência
    if (copyTextToClipboard(linkedInShareText, shareLinkedInButton)) {
      // Abre a janela de compartilhamento do LinkedIn
      const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        pageUrl
      )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
        summary
      )}&source=${encodeURIComponent(pageUrl)}`;

      window.open(linkedInShareUrl, "_blank", "width=600,height=400");

      // Feedback visual para o usuário
      const originalText = shareLinkedInButton.innerHTML;
      shareLinkedInButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg> Texto Copiado!';
      shareLinkedInButton.classList.add("bg-green-500", "hover:bg-green-600");
      shareLinkedInButton.classList.remove("bg-blue-500", "hover:bg-blue-600"); // Assuming LinkedIn button is blue

      setTimeout(() => {
        shareLinkedInButton.innerHTML = originalText;
        shareLinkedInButton.classList.add("bg-blue-500", "hover:bg-blue-600");
        shareLinkedInButton.classList.remove(
          "bg-green-500",
          "hover:bg-green-600"
        );
      }, 3000);

      displayTemporaryMessage(
        "Texto de compartilhamento copiado! Cole no LinkedIn."
      );
    }
  });

  // Event Listener para o botão de Publicidade do Site
  showAdTemplateButton.addEventListener("click", () => {
    adTemplateModal.classList.remove("hidden");
    adTemplateModal.classList.add("show"); // Adiciona a classe 'show' para exibir o modal com transição
  });

  // Event Listener para fechar o modal de publicidade
  closeAdModalButton.addEventListener("click", () => {
    adTemplateModal.classList.add("hidden");
    adTemplateModal.classList.remove("show"); // Remove a classe 'show' para ocultar o modal com transição
    copyConfirmation.classList.add("hidden");
  });

  // Event Listener para copiar o texto do template de publicidade
  copyAdTextButton.addEventListener("click", () => {
    copyTextToClipboard(adTextArea.value, copyAdTextButton, copyConfirmation);
  });

  // --- Funcionalidade do Botão "Gostei" ---
  likeButton.addEventListener("click", () => {
    if (!hasLiked) {
      likeCounter++;
      likeCountSpan.textContent = likeCounter;
      localStorage.setItem("likeCount", likeCounter);

      hasLiked = true;
      localStorage.setItem("hasLiked", "true");

      likeButton.disabled = true;
      likeButton.classList.remove("bg-purple-500", "hover:bg-purple-600");
      likeButton.classList.add("bg-gray-400", "cursor-not-allowed");

      displayTemporaryMessage("Obrigado pelo seu like!");
    } else {
      displayTemporaryMessage("Você já deu like nesta página!", true);
    }
  });

  // --- Funcionalidade da Caixa de Sugestões ---
  showSuggestionsButton.addEventListener("click", () => {
    suggestionsModal.classList.remove("hidden");
    suggestionsModal.classList.add("show"); // Adiciona a classe 'show' para exibir o modal com transição
  });

  closeSuggestionsModalButton.addEventListener("click", () => {
    suggestionsModal.classList.add("hidden");
    suggestionsModal.classList.remove("show"); // Remove a classe 'show' para ocultar o modal com transição
    suggestionConfirmation.classList.add("hidden");
  });

  suggestionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const suggestionText = suggestionInput.value.trim();
    if (suggestionText === "") {
      displayTemporaryMessage(
        "Por favor, digite sua sugestão antes de enviar.",
        true
      );
      return;
    }

    const formData = new FormData();
    formData.append("suggestion", suggestionText);

    try {
      const response = await fetch(suggestionForm.action, {
        method: suggestionForm.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        displayTemporaryMessage("Sugestão enviada com sucesso!");
        suggestionConfirmation.classList.remove("hidden");
        suggestionInput.value = "";

        setTimeout(() => {
          suggestionsModal.classList.add("hidden");
          suggestionsModal.classList.remove("show"); // Remove a classe 'show' para ocultar o modal com transição
          suggestionConfirmation.classList.add("hidden");
        }, 2000);
      } else {
        const errorData = await response.json();
        displayTemporaryMessage(
          `Erro ao enviar sugestão: ${errorData.error || "Tente novamente."}`,
          true
        );
        console.error("Erro Formspree:", errorData);
      }
    } catch (error) {
      console.error("Erro na requisição fetch:", error);
      displayTemporaryMessage(
        "Ocorreu um erro de rede. Tente novamente.",
        true
      );
    }
  });

  // --- Event Listeners para o Modal de GIF/Imagem ---
  closeGifModalButton.addEventListener("click", () => {
    gifShareModal.classList.add("hidden");
    gifShareModal.classList.remove("show"); // Remove a classe 'show' para ocultar o modal com transição
    generatedGifImg.src = ""; // Limpa a imagem
    gifCopyConfirmation.classList.add("hidden"); // Esconde a confirmação de cópia
    downloadGifButton.classList.remove("hidden"); // Garante que o botão de download esteja visível na próxima vez
    downloadGifButton.textContent = "Baixar GIF"; // Reseta o texto do botão
    if (currentGifBlobUrl) {
      URL.revokeObjectURL(currentGifBlobUrl); // Libera o URL do blob ao fechar o modal
      currentGifBlobUrl = null;
    }
  });

  copyShareTextButton.addEventListener("click", () => {
    // Copia APENAS o texto da textarea
    copyTextToClipboard(
      socialShareTextarea.value,
      copyShareTextButton,
      gifCopyConfirmation
    );
  });

  // Event Listener para o botão de Baixar GIF (reintroduzido)
  downloadGifButton.addEventListener("click", (event) => {
    // Previne o comportamento padrão do link para que a lógica de download seja controlada pelo JS
    event.preventDefault();
    if (generatedGifImg.src) {
      const link = document.createElement("a");
      link.href = generatedGifImg.src;
      link.download = `pegadinha-${currentBotState.name.replace(
        /\s/g,
        "-"
      )}.gif`; // Nome do arquivo baseado na personalidade
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      displayTemporaryMessage("GIF baixado com sucesso!");
    } else {
      displayTemporaryMessage("Nenhum GIF disponível para download.", true);
    }
  });

  // Inicializa o estado do bot ao carregar a página
  applyBotState();

  // Inicializa o estado do bot ao carregar a página
  applyBotState();

  // Adiciona a mensagem inicial do bot dinamicamente
  addMessage(
    "bot",
    "Olá! Pronto para discutir algumas verdades? Ou você prefere a versão fantasiosa dos fatos?"
  );

  resetChatButton.addEventListener("click", () => {
    console.log("Botão de reset clicado"); // para teste no console

    // Limpa todas as mensagens do chat
    chatMessages.innerHTML = "";

    // Reseta o estado do bot para o original
    currentBotState = { ...originalBot };
    applyBotState();

    // Reseta as flags de pegadinhas
    pegadinhaTriggered = {
      boring: false,
      bored: false,
      philosophical: false,
    };

    // Mensagem inicial
    addMessage(
      "bot",
      "Olá! Pronto para discutir algumas verdades? Ou você prefere a versão fantasiosa dos fatos?"
    );
  });
});
