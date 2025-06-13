document.addEventListener('DOMContentLoaded', () => {
    // === Elementos do DOM ===
    const loginView = document.getElementById('login-view');
    const chatView = document.getElementById('chat-view');
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const authError = document.getElementById('auth-error');
    
    const welcomeUser = document.getElementById('welcome-user');
    const roomTitle = document.getElementById('room-title');
    const logoutBtn = document.getElementById('logout-btn');
    const joinRoomBtn = document.getElementById('join-room-btn');
    
    const chatMessages = document.getElementById('chat-messages');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    
    const roomModal = document.getElementById('room-modal');
    const roomForm = document.getElementById('room-form');
    const roomNameInput = document.getElementById('room-name-input');
    const roomError = document.getElementById('room-error');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // === Estado da Aplicação ===
    let state = {
        token: localStorage.getItem('chatToken'),
        username: localStorage.getItem('chatUsername'),
        ws: null,
        currentRoomId: null,
    };

    // === Funções Auxiliares de UI ===
    const showView = (viewId) => {
        loginView.classList.add('hidden');
        chatView.classList.add('hidden');
        document.getElementById(viewId).classList.remove('hidden');
    };

    const showAlert = (element, message) => {
        element.textContent = message;
        element.classList.remove('hidden');
    };
    
    const hideAlert = (element) => {
        element.classList.add('hidden');
    };

    const appendMessage = (msg) => {
        const isSystem = msg.userId === 'system';
        const isMe = msg.username === state.username;
        
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('flex', 'items-start', 'gap-2.5', 'max-w-xl');

        if(isSystem) {
             msgDiv.classList.add('mx-auto');
        } else if (isMe) {
            msgDiv.classList.add('ml-auto', 'flex-row-reverse');
        }

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('flex', 'flex-col', 'gap-1', 'p-3', 'rounded-xl');

        if(isSystem){
            contentDiv.classList.add('bg-gray-700', 'text-gray-300', 'text-sm', 'italic');
            contentDiv.textContent = msg.text;
        } else {
             if(isMe){
                 contentDiv.classList.add('bg-indigo-600', 'rounded-br-none');
             } else {
                 contentDiv.classList.add('bg-gray-700', 'rounded-bl-none');
                 const usernameP = document.createElement('p');
                 usernameP.classList.add('text-sm', 'font-semibold', 'text-indigo-400');
                 usernameP.textContent = msg.username;
                 contentDiv.appendChild(usernameP);
             }
             const textP = document.createElement('p');
             textP.classList.add('text-white');
             textP.textContent = msg.text;
             contentDiv.appendChild(textP);
        }

        msgDiv.appendChild(contentDiv);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };


    // === Lógica de Autenticação ===
    const handleAuth = async (endpoint) => {
        hideAlert(authError);
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro desconhecido');
            }
            
            if (endpoint === 'login') {
                 state.token = result.token;
                 state.username = data.username;
                 localStorage.setItem('chatToken', state.token);
                 localStorage.setItem('chatUsername', state.username);
                 initChatView();
            } else {
                showAlert(authError, 'Usuário registrado com sucesso! Faça o login.');
                loginForm.reset();
            }
        } catch (err) {
            showAlert(authError, err.message);
        }
    };
    
    const logout = () => {
        state.ws?.close();
        localStorage.removeItem('chatToken');
        localStorage.removeItem('chatUsername');
        state = { token: null, username: null, ws: null, currentRoomId: null };
        showView('login-view');
    }

    // === Lógica do WebSocket ===
    const connectWebSocket = () => {
        if (!state.token) return;
        
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        state.ws = new WebSocket(`${wsProtocol}//${window.location.host}?token=${state.token}`);

        state.ws.onopen = () => console.log('WebSocket conectado!');
        state.ws.onclose = () => console.log('WebSocket desconectado.');
        state.ws.onmessage = handleWebSocketMessage;
        state.ws.onerror = (err) => console.error('Erro no WebSocket:', err);
    };

    const handleWebSocketMessage = (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
            case 'ROOM_CREATED':
                joinRoom(msg.roomId, msg.roomName);
                break;
            case 'PREVIOUS_MESSAGES':
                msg.messages.forEach(appendMessage);
                break;
            case 'NEW_MESSAGE':
                appendMessage(msg);
                break;
            case 'ERROR':
                showAlert(roomError, msg.message);
                break;
        }
    };

    const wsSend = (payload) => {
        if (state.ws && state.ws.readyState === WebSocket.OPEN) {
            state.ws.send(JSON.stringify(payload));
        }
    };

    // === Lógica de Salas e Mensagens ===
    const createRoom = (roomName) => {
        wsSend({ type: 'CREATE_ROOM', roomName });
    };
    
    const joinRoom = (roomId, roomName) => {
        if(state.currentRoomId === roomId) return; // Já está na sala
        
        chatMessages.innerHTML = ''; // Limpa mensagens antigas
        state.currentRoomId = roomId;
        roomTitle.textContent = roomName;
        messageForm.querySelector('button').disabled = false;
        
        wsSend({ type: 'JOIN_ROOM', roomId });
        roomModal.classList.add('hidden');
    };
    
    // === Inicialização e Event Listeners ===
    const initChatView = () => {
        showView('chat-view');
        welcomeUser.textContent = `Bem-vindo, ${state.username}!`;
        connectWebSocket();
    };
    
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleAuth('login');
    });

    registerBtn.addEventListener('click', () => handleAuth('register'));
    logoutBtn.addEventListener('click', logout);
    
    joinRoomBtn.addEventListener('click', () => roomModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => roomModal.classList.add('hidden'));

    roomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideAlert(roomError);
        const roomName = roomNameInput.value.trim();
        if (roomName) createRoom(roomName);
    });

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if (text && state.currentRoomId) {
            wsSend({ type: 'SEND_MESSAGE', text });
            messageInput.value = '';
        }
    });

    // === Ponto de Entrada da Aplicação ===
    if (state.token && state.username) {
        initChatView();
    } else {
        showView('login-view');
    }
});
