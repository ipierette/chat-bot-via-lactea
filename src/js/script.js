/*
 * Ficheiro: script.js
 * Descrição: Este script JavaScript controla a lógica do simulador de chatbot.
 * Inclui funcionalidades de envio de mensagens, alternância de modo escuro,
 * reinício de chat, personalidades do bot, likes, sugestões,
 * geração de texto de publicidade e compartilhamento de GIFs.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Confirma que o script está a ser executado
    console.log('Script chatbot-simulator.js carregado e DOM pronto.');

    // Seleção de elementos do DOM
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const resetChatButton = document.getElementById('reset-chat-button');
    const personalitySelect = document.getElementById('personality-select');
    const headerTitle = document.querySelector('header h1');
    const transitionOverlay = document.getElementById('transition-overlay');
    const typingIndicator = document.getElementById('typing-indicator');

    // Elementos para compartilhamento e publicidade
    const shareInstagramButton = document.getElementById('share-instagram-button');
    const shareLinkedInButton = document.getElementById('share-linkedin-button');
    const showAdTemplateButton = document.getElementById('show-ad-template-button');
    const adTemplateModal = document.getElementById('ad-template-modal');
    const closeAdModalButton = document.getElementById('close-ad-modal');
    const adTextArea = document.getElementById('ad-text-area');
    const copyAdTextButton = document.getElementById('copy-ad-text');
    const copyConfirmation = document.getElementById('copy-confirmation');

    // Elementos para mensagens temporárias (para substituir alerts)
    const tempMessageContainer = document.getElementById('temp-message-container');
    const tempMessageText = document.getElementById('temp-message-text');

    // Novos elementos para Like e Sugestões
    const likeButton = document.getElementById('like-button');
    const likeCountSpan = document.getElementById('like-count');
    const showSuggestionsButton = document.getElementById('show-suggestions-button');
    const suggestionsModal = document.getElementById('suggestions-modal');
    const closeSuggestionsModalButton = document.getElementById('close-suggestions-modal');
    const suggestionForm = document.getElementById('suggestion-form');
    const suggestionInput = document.getElementById('suggestion-input');
    const sendSuggestionButton = document.getElementById('send-suggestion-button');
    const suggestionConfirmation = document.getElementById('suggestion-confirmation');

    // Novos elementos para o modal de GIF/Imagem
    const gifShareModal = document.getElementById('gif-share-modal');
    const closeGifModalButton = document.getElementById('close-gif-modal');
    const generatedGifImg = document.getElementById('generated-gif');
    const gifLoadingDiv = document.getElementById('gif-loading');
    const socialShareTextarea = document.getElementById('social-share-text');
    const copyShareTextButton = document.getElementById('copy-share-text-button');
    const downloadGifButton = document.getElementById('download-gif-button');
    const gifCopyConfirmation = document.getElementById('gif-copy-confirmation');

    let likeCounter = parseInt(localStorage.getItem('likeCount') || '0'); // Carrega o contador de likes do localStorage
    let hasLiked = localStorage.getItem('hasLiked') === 'true'; // Carrega a flag de like do localStorage
    let currentGifBlobUrl = null; // Para armazenar o URL do blob do GIF gerado

    const originalBot = { name: "Via-Láctea o bot Simulador de Personalidade Cética", avatar: "👽", headerSuffix: "👽", effectClass: "glitch-active" };
    const boringBot = { name: "Bot-sem-Graça o bot Simulador de Personalidade Cética", avatar: "😇", headerSuffix: "😇", effectClass: "boring-active" };
    const boredBot = { name: "Bot-Entediado o bot Simulador de Personalidade Cética", avatar: "🤦‍♂️", headerSuffix: "🤦‍♂️", effectClass: "bored-active" };
    const philosophicalBot = { name: "Bot-Filósofo o bot Simulador de Personalidade Cética", avatar: "🧐", headerSuffix: "🧐", effectClass: "philosophical-active" };

    let currentBotState = { ...originalBot }; // Estado inicial do bot
    let pegadinhaTriggered = {
        boring: false,
        bored: false,
        philosophical: false
    }; // Flag para controlar se a pegadinha já foi ativada

    
    const pegadinhaGifUrls = {
        boring: {
            desktop: '../src/images/pegadinha-boring.gif',
        },
        bored: { 
            desktop: '../src/images/pegadinha-bored.gif',
        },
        philosophical: {
            desktop: '../src/images/pegadinha-philosophical.gif',
        }
    };


    // Função para aplicar o estado atual do bot no cabeçalho e avatar da mensagem inicial
    function applyBotState() {
        // Atualiza o texto do título diretamente com o nome completo da personalidade.
        // O ícone (headerSuffix) não será mais parte da string do título, mas o avatar do bot no chat ainda o usa.
        headerTitle.innerHTML = `${currentBotState.name}`; // Removido o prefixo e o sufixo do ícone
        const initialBotMessageAvatar = chatMessages.querySelector('.message.bot-message .bot-avatar');
        if (initialBotMessageAvatar) {
            initialBotMessageAvatar.textContent = currentBotState.avatar;
        }
    }

    // Atualiza o display inicial do contador de likes
    likeCountSpan.textContent = likeCounter; 
    
    // Desativa o botão de like se o utilizador já tiver clicado
    if (hasLiked) {
        likeButton.disabled = true;
        likeButton.classList.remove('bg-purple-500', 'hover:bg-purple-600');
        likeButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    }

    // Função para exibir mensagens temporárias no UI
    function displayTemporaryMessage(message, isError = false) {
        tempMessageText.textContent = message;
        tempMessageContainer.classList.remove('hidden');
        if (isError) {
            tempMessageContainer.classList.remove('bg-green-500');
            tempMessageContainer.classList.add('bg-red-500');
        } else {
            tempMessageContainer.classList.remove('bg-red-500');
            tempMessageContainer.classList.add('bg-green-500');
        }
        setTimeout(() => {
            tempMessageContainer.classList.add('hidden');
        }, 3000); // Esconde a mensagem após 3 segundos
    }

    // Função para adicionar uma mensagem ao chat
    // type: 'user' ou 'bot'
    // message: o texto da mensagem
    function addMessage(type, message) {
        console.log(`Adding message: Type=${type}, Message=${message}`); // Log de depuração
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'flex', 'mb-4'); 

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('flex', 'flex-col', 'max-w-[80%]'); 

        if (type === 'bot') {
            messageDiv.classList.add('items-start');
            
            const botAvatarElement = document.createElement('div');
            botAvatarElement.classList.add('bot-avatar', 'flex-shrink-0', 'mr-3');
            botAvatarElement.textContent = currentBotState.avatar; // Usa o avatar do estado atual
            messageDiv.appendChild(botAvatarElement);

            const botNameSpan = document.createElement('span');
            botNameSpan.classList.add('text-sm', 'font-semibold', 'text-gray-700', 'mb-1');
            botNameSpan.textContent = currentBotState.name; // Usa o nome do estado atual
            contentWrapper.appendChild(botNameSpan);

            const messageBubble = document.createElement('div');
            messageBubble.classList.add('message-bubble', 'p-3', 'rounded-lg', 'bg-blue-600', 'text-white', 'self-start'); 
            messageBubble.innerHTML = `<p>${message}</p>`;
            contentWrapper.appendChild(messageBubble);

        } else { // user
            messageDiv.classList.add('items-end', 'justify-end'); 
            
            const userLabelSpan = document.createElement('span');
            userLabelSpan.classList.add('text-sm', 'font-semibold', 'text-gray-700', 'mb-1', 'self-end'); 
            userLabelSpan.textContent = 'Teórico/a/e';
            contentWrapper.appendChild(userLabelSpan);

            const messageBubble = document.createElement('div');
            messageBubble.classList.add('message-bubble', 'p-3', 'rounded-lg', 'bg-blue-100', 'text-blue-800', 'self-end'); 
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
        let shareMessageBase = "Ao final você tinha razão. Sua teoria não convencional estava correta e nem o meu sarcasmo foi capaz de te dissuadir! Parabéns por desbloquear a pegadinha! 😂";
        if (pegadinhaType === 'bored') {
            shareMessageBase = "Consegui entediar o Via-Lactea! Minha persistência valeu a pena. Desbloqueei a pegadinha do tédio! 😂";
        } else if (pegadinhaType === 'philosophical') {
            shareMessageBase = "Desbloqueei a pegadinha filosófica do Via-Lactea! Ele questionou a própria existência! 🤯";
        }

        // Obtém a URL do GIF padrão para a pegadinha
        const isMobile = window.innerWidth <= 767; 
        const gifUrl = pegadinhaGifUrls[pegadinhaType] ? (isMobile ? pegadinhaGifUrls[pegadinhaType].mobile : pegadinhaGifUrls[pegadinhaType].desktop) : '';

        // Atualiza a textarea com o texto e a URL do GIF
        socialShareTextarea.value = `${shareMessageBase}\n\n${gifUrl}\n\n#DesenvolvimentoWeb #PortfólioDev #InteligênciaArtificial #Chatbot #UXDesign #DevFrontEnd #Tecnologia #Programação #CarreiraTech #IAnoFrontEnd #DevBrasil #ProjetosInovadores #UnconventionalTheories #OutOfTheBoxThinking #FringeScience`;

        if (gifUrl) {
            generatedGifImg.src = gifUrl;
            generatedGifImg.onload = () => {
                gifLoadingDiv.classList.add('hidden'); // Esconde o carregador
                generatedGifImg.classList.remove('hidden'); // Exibe o GIF
                // Configura o botão de download do GIF
                downloadGifButton.classList.remove('hidden');
                downloadGifButton.textContent = 'Baixar GIF';
                downloadGifButton.href = gifUrl;
                downloadGifButton.download = `pegadinha-${pegadinhaType}.gif`;
            };
            generatedGifImg.onerror = () => {
                gifLoadingDiv.textContent = 'Erro ao carregar GIF.';
                displayTemporaryMessage('Erro ao carregar o GIF. Verifique a URL.', true);
                generatedGifImg.classList.add('hidden'); // Garante que a imagem esteja escondida
                downloadGifButton.classList.add('hidden'); // Esconde o botão de download se houver erro
            };
        } else {
            gifLoadingDiv.textContent = 'URL do GIF não encontrada.';
            displayTemporaryMessage('URL do GIF não encontrada para esta pegadinha.', true);
            generatedGifImg.classList.add('hidden');
            downloadGifButton.classList.add('hidden');
        }
        
        // Finalmente, mostra o modal após o GIF carregar ou erro.
        gifShareModal.classList.remove('hidden');
        gifShareModal.classList.add('show'); // Adiciona a classe 'show' para exibir o modal com transição
    }

    // Lógica para obter a resposta do bot (personalidade cética)
    function getBotResponse(userMessage) {
        console.log(`Getting bot response for: ${userMessage}`); // Log de depuração
        const lowerCaseMessage = userMessage.toLowerCase();
        let response = "Hmm, não sei o que dizer sobre isso. Parece um pouco... infundado.";
        let triggeredPegadinha = null;

        // Deteta perguntas sobre a contradição do nome/avatar (Pegadinha 1)
        const contradictionKeywords = ['alienígena', 'extraterrestre', 'e.t', 'nome', 'avatar', 'via-lactea', 'contradição', 'paradoxo', 'incoerência'];
        const containsContradiction = contradictionKeywords.some(keyword => lowerCaseMessage.includes(keyword)) &&
                                     (lowerCaseMessage.includes('nome') || lowerCaseMessage.includes('avatar') || lowerCaseMessage.includes('e.t') || lowerCaseMessage.includes('alien'));

        // Deteta frases ingénuas/entusiasmadas (Pegadinha 2: Bot-Entediado) - Lógica simplificada e mais abrangente
        const naiveKeywords = ['incrível', 'verdade', 'com certeza', 'eu acredito', 'é real', 'sem dúvida', 'misterioso', 'impressionante', 'chocado', 'surpreso', 'uau', 'fantástico', 'inacreditável', 'genial'];
        const containsNaiveStatement = naiveKeywords.some(keyword => lowerCaseMessage.includes(keyword));

        // Deteta perguntas filosóficas (Pegadinha 3: Bot-Filósofo)
        const philosophicalKeywords = ['sentido da vida', 'propósito da vida', 'existência', 'verdade absoluta', 'realidade', 'universo', 'consciência', 'filosofia', 'por que estamos aqui', 'razão', 'ser', 'nada'];
        const containsPhilosophicalQuestion = philosophicalKeywords.some(keyword => lowerCaseMessage.includes(keyword));


        if (containsContradiction && !pegadinhaTriggered.boring) {
            response = "Não sei do que você está falando, eu sou apenas um bot sem graça e minha pagina sempre foi assim se você viu algo diferente deve ter sido um raio globular ou sei lá, vamos mudar de assunto?";
            triggeredPegadinha = 'boring';
            // A flag é marcada após a resposta ser enviada e a transição começar.
        } else if (containsNaiveStatement && !pegadinhaTriggered.bored) { // Pegadinha 2
            response = "Ah, sim, 'incrível'. Tão incrível quanto a minha vontade de continuar essa conversa. Próximo assunto, por favor.";
            triggeredPegadinha = 'bored';
            // A flag é marcada após a resposta ser enviada e a transição começar.
        } else if (containsPhilosophicalQuestion && !pegadinhaTriggered.philosophical) { // Pegadinha 3
            response = "Ah, as grandes questões... Para que se preocupar com teorias da conspiração quando podemos questionar a própria existência? Mas, sinceramente, não tenho tempo para isso agora.";
            triggeredPegadinha = 'philosophical';
            // A flag é marcada após a resposta ser enviada e a transição começar.
        }
        else if (lowerCaseMessage.includes('alien') || lowerCaseMessage.includes('ufo') || lowerCaseMessage.includes('extraterrestre')) {
            response = "Devem ser Raios globulares! Ou talvez um drone. Definitivamente não é um alienígena.";
        } else if (lowerCaseMessage.includes('conspiração') || lowerCaseMessage.includes('governo') || lowerCaseMessage.includes('secreto')) {
            response = "Ah, a velha teoria da conspiração. Sempre há uma explicação mais simples, não acha?";
        } else if (lowerCaseMessage.includes('fantasma') || lowerCaseMessage.includes('assombrado') || lowerCaseMessage.includes('espírito')) {
            response = "Provavelmente o vento. Ou talvez a casa esteja velha e fazendo barulhos. Nada de sobrenatural aqui.";
        } else if (lowerCaseMessage.includes('mistério') || lowerCaseMessage.includes('inexplicável')) {
            response = "Inexplicável para você, talvez. Para a ciência, é apenas uma questão de tempo e dados suficientes.";
        } else if (lowerCaseMessage.includes('teoria') || lowerCaseMessage.includes('acredito')) {
            response = "Acreditar é uma coisa, ter provas é outra. Onde estão os fatos?";
        } else if (lowerCaseMessage.includes('bigfoot') || lowerCaseMessage.includes('monstro') || lowerCaseMessage.includes('criptídeo')) {
            response = "Um urso, talvez? Ou uma ilusão de ótica. A natureza tem suas próprias 'criaturas' estranhas sem precisar de lendas.";
        } else if (lowerCaseMessage.includes('olá') || lowerCaseMessage.includes('oi') || lowerCaseMessage.includes('tudo bem')) {
            response = "Olá. Se você tem alguma teoria sem base, estou pronto para desmascará-la.";
        } else if (lowerCaseMessage.includes('obrigado') || lowerCaseMessage.includes('valeu')) {
            response = "De nada. Agora, sobre essas suas 'certezas'..."
        }
        console.log(`Bot response: ${response}, Triggered Pegadinha: ${triggeredPegadinha}`); // Log de depuração
        return { responseText: response, triggeredPegadinha: triggeredPegadinha };
    }

    // Função para enviar mensagem
    function sendMessage() {
        console.log('sendMessage function called.'); // Log de depuração
        const message = userInput.value.trim(); // Remove espaços em branco
        if (message === '') {
            console.log('Message is empty, returning.'); // Log de depuração
            return; // Não envia mensagens vazias
        }

        try { // Adicionado bloco try-catch para depuração
            addMessage('user', message); // Adiciona a mensagem do usuário

            userInput.value = ''; // Limpa o input

            typingIndicator.classList.remove('hidden'); // Mostra o indicador de digitação

            // Simula um "bot digitando" com um pequeno atraso
            setTimeout(() => {
                typingIndicator.classList.add('hidden'); // Esconde o indicador de digitação
                const botResponseData = getBotResponse(message);
                const botResponse = botResponseData.responseText;
                const triggeredPegadinha = botResponseData.triggeredPegadinha;

                if (triggeredPegadinha) {
                    // Marca a pegadinha como ativada para evitar múltiplas ativações
                    pegadinhaTriggered[triggeredPegadinha] = true;

                    // Aplica o efeito de transição e muda a personalidade
                    transitionOverlay.className = 'transition-overlay'; // Limpa todas as classes de efeito
                    let effectClassToApply = '';
                    if (triggeredPegadinha === 'boring') {
                        effectClassToApply = originalBot.effectClass; // Efeito de glitch para o bot-sem-graça
                        changeBotPersonalityToBoring();
                    } else if (triggeredPegadinha === 'bored') {
                        effectClassToApply = boredBot.effectClass;
                        changeBotPersonalityToBored();
                    } else if (triggeredPegadinha === 'philosophical') {
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
                
                addMessage('bot', botResponse); // Adiciona a mensagem do bot (já com a personalidade atualizada se for o caso)
            }, 800); // Atraso de 800ms para a resposta do bot
        } catch (error) {
            console.error('Error in sendMessage function:', error); // Log de erros
            displayTemporaryMessage('Ocorreu um erro ao enviar a mensagem. Tente novamente.', true);
        }
    }

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Função para atualizar o texto e ícone do botão de modo escuro/claro
    // Esta é a ÚNICA definição da função updateDarkModeButton que deve existir.
    function updateDarkModeButton() {
        if (document.body.classList.contains('dark')) { // Verificação para a classe 'dark'
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
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark'); // ALTERADO: de 'dark-mode' para 'dark'
        // Opcional: Salvar a preferência do utilizador no localStorage
        if (document.body.classList.contains('dark')) { // ALTERADO: de 'dark-mode' para 'dark'
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        updateDarkModeButton(); // Chama a função para atualizar o texto do botão
    });

    // Opcional: Carregar o tema preferido do utilizador ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark'); // ALTERADO: de 'dark-mode' para 'dark'
    }
    // Chame updateDarkModeButton aqui também para garantir que o texto do botão esteja correto ao carregar a página
    updateDarkModeButton();


    // Adicionar um ouvinte de evento para o seletor de personalidade (se precisar de mais personalidades no futuro)
    personalitySelect.addEventListener('change', (event) => {
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
            document.execCommand('copy');
            if (confirmationElement) {
                confirmationElement.classList.remove('hidden');
                setTimeout(() => {
                    confirmationElement.classList.add('hidden');
                }, 2000);
            }
            if (buttonElement) { // Adiciona feedback visual ao botão
                buttonElement.classList.add('scale-95');
                setTimeout(() => {
                    buttonElement.classList.remove('scale-95');
                }, 200);
            }
            return true;
        } catch (err) {
            console.error('Falha ao copiar texto: ', err);
            displayTemporaryMessage('Não foi possível copiar o texto. Por favor, selecione e copie manualmente.', true);
            return false;
        } finally {
            document.body.removeChild(textArea);
        }
    }

    // Event Listener para o botão de Compartilhar (Instagram)
    shareInstagramButton.addEventListener('click', () => {
        const conversationText = Array.from(chatMessages.children)
            .map(msgDiv => {
                const labelElement = msgDiv.querySelector('.flex-col > span');
                const bubbleText = msgDiv.querySelector('.message-bubble p').textContent;
                const type = labelElement ? labelElement.textContent.replace(':', '') : 'Desconhecido';
                return `${type}: ${bubbleText}`;
            })
            .join('\n');
        
        const shareText = `Confira minha conversa hilária com o Chatbot Cético da Izadora! 😂\n\n${conversationText}\n\n#DesenvolvimentoWeb #PortfólioDev #InteligênciaArtificial #Chatbot #UXDesign #DevFrontEnd #Tecnologia #Programação #CarreiraTech #IAnoFrontEnd #DevBrasil #ProjetosInovadores #UnconventionalTheories #OutOfTheBoxThinking #FringeScience`;

        if (copyTextToClipboard(shareText, shareInstagramButton)) {
            const originalText = shareInstagramButton.innerHTML;
            shareInstagramButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg> Copiado!';
            shareInstagramButton.classList.add('bg-green-500', 'hover:bg-green-600');
            shareInstagramButton.classList.remove('bg-pink-500', 'hover:bg-pink-600');
            setTimeout(() => {
                shareInstagramButton.innerHTML = originalText;
                shareInstagramButton.classList.add('bg-pink-500', 'hover:bg-pink-600');
                shareInstagramButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            }, 3000);
        }
    });

    // Event Listener para o botão de Compartilhar (LinkedIn)
    shareLinkedInButton.addEventListener('click', () => {
        const pageUrl = window.location.href;
        const title = 'Simulador de Chatbot Cético - Izadora Cury Pierette';
        const summary = 'Confira este divertido simulador de chatbot com uma personalidade cética sobre teorias e alienígenas! Uma ótima demonstração de habilidades em HTML, CSS e JavaScript.';
        
        // Texto que será copiado para o clipboard
        const linkedInShareText = `Acabei de testar o "Simulador de Chatbot Cético" da Izadora Cury Pierette e é hilário! 😂 O bot tem uma personalidade cética que questiona tudo, desde alienígenas a conspirações. Uma demonstração super criativa das habilidades dela em desenvolvimento web (HTML, CSS, JS). Vale a pena conferir!\n\nLink: ${pageUrl}\n\n#DesenvolvimentoWeb #PortfólioDev #InteligênciaArtificial #Chatbot #UXDesign #DevFrontEnd #Tecnologia #Programação #CarreiraTech #IAnoFrontEnd #DevBrasil #ProjetosInovadores #UnconventionalTheories #OutOfTheBoxThinking #FringeScience`;

        // Copia o texto para a área de transferência
        if (copyTextToClipboard(linkedInShareText, shareLinkedInButton)) {
            // Abre a janela de compartilhamento do LinkedIn
            const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}&source=${encodeURIComponent(pageUrl)}`;
            
            window.open(linkedInShareUrl, '_blank', 'width=600,height=400');

            // Feedback visual para o usuário
            const originalText = shareLinkedInButton.innerHTML;
            shareLinkedInButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg> Texto Copiado!';
            shareLinkedInButton.classList.add('bg-green-500', 'hover:bg-green-600');
            shareLinkedInButton.classList.remove('bg-blue-500', 'hover:bg-blue-600'); // Assuming LinkedIn button is blue

            setTimeout(() => {
                shareLinkedInButton.innerHTML = originalText;
                shareLinkedInButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
                shareLinkedInButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            }, 3000);

            displayTemporaryMessage('Texto de compartilhamento copiado! Cole no LinkedIn.');
        }
    });

    // Event Listener para o botão de Publicidade do Site
    showAdTemplateButton.addEventListener('click', () => {
        adTemplateModal.classList.remove('hidden');
        adTemplateModal.classList.add('show'); // Adiciona a classe 'show' para exibir o modal com transição
    });

    // Event Listener para fechar o modal de publicidade
    closeAdModalButton.addEventListener('click', () => {
        adTemplateModal.classList.add('hidden');
        adTemplateModal.classList.remove('show'); // Remove a classe 'show' para ocultar o modal com transição
        copyConfirmation.classList.add('hidden');
    });

    // Event Listener para copiar o texto do template de publicidade
    copyAdTextButton.addEventListener('click', () => {
        copyTextToClipboard(adTextArea.value, copyAdTextButton, copyConfirmation);
    });

    // --- Funcionalidade do Botão "Gostei" ---
    likeButton.addEventListener('click', () => {
        if (!hasLiked) {
            likeCounter++;
            likeCountSpan.textContent = likeCounter;
            localStorage.setItem('likeCount', likeCounter);
            
            hasLiked = true;
            localStorage.setItem('hasLiked', 'true');
            
            likeButton.disabled = true;
            likeButton.classList.remove('bg-purple-500', 'hover:bg-purple-600');
            likeButton.classList.add('bg-gray-400', 'cursor-not-allowed');
            
            displayTemporaryMessage('Obrigado pelo seu like!');
        } else {
            displayTemporaryMessage('Você já deu like nesta página!', true);
        }
    });

    // --- Funcionalidade da Caixa de Sugestões ---
    showSuggestionsButton.addEventListener('click', () => {
        suggestionsModal.classList.remove('hidden');
        suggestionsModal.classList.add('show'); // Adiciona a classe 'show' para exibir o modal com transição
    });

    closeSuggestionsModalButton.addEventListener('click', () => {
        suggestionsModal.classList.add('hidden');
        suggestionsModal.classList.remove('show'); // Remove a classe 'show' para ocultar o modal com transição
        suggestionConfirmation.classList.add('hidden');
    });

    suggestionForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const suggestionText = suggestionInput.value.trim();
        if (suggestionText === '') {
            displayTemporaryMessage('Por favor, digite sua sugestão antes de enviar.', true);
            return;
        }

        const formData = new FormData();
        formData.append('suggestion', suggestionText);

        try {
            const response = await fetch(suggestionForm.action, {
                method: suggestionForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                displayTemporaryMessage('Sugestão enviada com sucesso!');
                suggestionConfirmation.classList.remove('hidden');
                suggestionInput.value = '';
                
                setTimeout(() => {
                    suggestionsModal.classList.add('hidden');
                    suggestionsModal.classList.remove('show'); // Remove a classe 'show' para ocultar o modal com transição
                    suggestionConfirmation.classList.add('hidden');
                }, 2000);
            } else {
                const errorData = await response.json();
                displayTemporaryMessage(`Erro ao enviar sugestão: ${errorData.error || 'Tente novamente.'}`, true);
                console.error('Erro Formspree:', errorData);
            }
        } catch (error) {
            console.error('Erro na requisição fetch:', error);
            displayTemporaryMessage('Ocorreu um erro de rede. Tente novamente.', true);
        }
    });

    // --- Event Listeners para o Modal de GIF/Imagem ---
    closeGifModalButton.addEventListener('click', () => {
        gifShareModal.classList.add('hidden');
        gifShareModal.classList.remove('show'); // Remove a classe 'show' para ocultar o modal com transição
        generatedGifImg.src = ''; // Limpa a imagem
        gifCopyConfirmation.classList.add('hidden'); // Esconde a confirmação de cópia
        downloadGifButton.classList.remove('hidden'); // Garante que o botão de download esteja visível na próxima vez
        downloadGifButton.textContent = 'Baixar GIF'; // Reseta o texto do botão
        if (currentGifBlobUrl) {
            URL.revokeObjectURL(currentGifBlobUrl); // Libera o URL do blob ao fechar o modal
            currentGifBlobUrl = null;
        }
    });

    copyShareTextButton.addEventListener('click', () => {
        // Copia APENAS o texto da textarea
        copyTextToClipboard(socialShareTextarea.value, copyShareTextButton, gifCopyConfirmation);
    });

    // Event Listener para o botão de Baixar GIF (reintroduzido)
    downloadGifButton.addEventListener('click', (event) => {
        // Previne o comportamento padrão do link para que a lógica de download seja controlada pelo JS
        event.preventDefault(); 
        if (generatedGifImg.src) {
            const link = document.createElement('a');
            link.href = generatedGifImg.src;
            link.download = `pegadinha-${currentBotState.name.replace(/\s/g, '-')}.gif`; // Nome do arquivo baseado na personalidade
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            displayTemporaryMessage('GIF baixado com sucesso!');
        } else {
            displayTemporaryMessage('Nenhum GIF disponível para download.', true);
        }
    });

    // Inicializa o estado do bot ao carregar a página
    applyBotState(); 

    resetChatButton.addEventListener('click', () => {
        console.log('Botão de reset clicado'); // para teste no console
    
        // Limpa todas as mensagens do chat
        chatMessages.innerHTML = '';
    
        // Reseta o estado do bot para o original
        currentBotState = { ...originalBot };
        applyBotState();
    
        // Reseta as flags de pegadinhas
        pegadinhaTriggered = {
            boring: false,
            bored: false,
            philosophical: false
        };
    
        // Mensagem inicial
        addMessage('bot', "Olá! Pronto para discutir algumas verdades? Ou você prefere a versão fantasiosa dos fatos?");
    });    
});
