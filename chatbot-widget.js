// Fixed Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            z-index: 999999;
        }
        
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
            flex-direction: column;
        }
        
        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }
        
        .n8n-chat-widget .chat-container.open {
            display: flex;
        }
        
        .n8n-chat-widget .chat-content {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
        }
        
        .n8n-chat-widget .welcome-view {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        
        .n8n-chat-widget .chat-view {
            display: none;
            flex-direction: column;
            height: 100%;
        }
        
        .n8n-chat-widget .chat-view.active {
            display: flex;
        }
        
        .n8n-chat-widget .welcome-view.hidden {
            display: none;
        }
        
        .n8n-chat-widget .brand-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
            padding-right: 56px;            /* reserve space for the X */
            text-align: left;               /* neutralize any inherited centering */
        }
        
        .n8n-chat-widget .brand-header span {
            flex: 1;                        /* take remaining space */
            display: block;
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
            text-align: left;               /* ensure left alignment */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: 0;
            color: var(--chat--color-font);
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }
        
        .n8n-chat-widget .close-button:hover { 
            opacity: 1; 
        }
        
        .n8n-chat-widget .close-button:focus-visible {
            outline: 2px solid var(--chat--color-primary);
            outline-offset: 2px;
        }
        
        .n8n-chat-widget .brand-header .logo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
            color: white;
            flex: 0 0 40px;                 /* don't shrink; fixed width */
            overflow: hidden;               /* hide overflow if image inside */
        }
        
        .n8n-chat-widget .brand-header .logo img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            display: block;
        }
        
        .n8n-chat-widget .brand-header .info {
            flex: 1;
            min-width: 0;
        }
        
        .n8n-chat-widget .brand-header .info h3 {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 4px 0;
            color: white;
        }
        
        .n8n-chat-widget .brand-header .info p {
            font-size: 12px;
            opacity: 0.9;
            margin: 0;
            color: white;
        }
        
        .n8n-chat-widget .new-conversation {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
            text-align: center;
        }
        
        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }
        
        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }
        
        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }
        
        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }
        
        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }
        
        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
            width: 100%;
        }
        
        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }
        
        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-height: 0;
        }
        
        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 85%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
        }
        
        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 2px 8px rgba(133, 79, 255, 0.2);
            border-bottom-right-radius: 6px;
        }
        
        .n8n-chat-widget .chat-message.bot {
            background: #f8f9fa;
            border: 1px solid rgba(133, 79, 255, 0.1);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border-bottom-left-radius: 6px;
        }
        
        .n8n-chat-widget .chat-input {
            padding: 20px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            flex-shrink: 0;
        }
        
        .n8n-chat-widget .input-container {
            display: flex;
            gap: 8px;
            align-items: flex-end;
        }
        
        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 24px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            min-height: 44px;
            max-height: 120px;
            outline: none;
        }
        
        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }
        
        .n8n-chat-widget .chat-input textarea:focus {
            border-color: var(--chat--color-primary);
        }
        
        .n8n-chat-widget .chat-input .send-button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .n8n-chat-widget .chat-input .send-button:hover {
            transform: scale(1.05);
        }
        
        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(133, 79, 255, 0.3);
            z-index: 999998;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }
        
        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }
        
        .n8n-chat-widget .chat-footer {
            padding: 12px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            flex-shrink: 0;
        }
        
        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }
        
        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }
        
        /* Scrollbar styling */
        .n8n-chat-widget .chat-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        .n8n-chat-widget .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .n8n-chat-widget .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(133, 79, 255, 0.2);
            border-radius: 3px;
        }
        
        .n8n-chat-widget .chat-messages::-webkit-scrollbar-thumb:hover {
            background: rgba(133, 79, 255, 0.3);
        }
    `;
    
    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);
    
    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by n8n',
                link: 'https://n8n.partnerlinks.io/carlosvargas?utm_source=carlosvargas.com'
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };
    
    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;
    
    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;
    
    let currentSessionId = '';
    
    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);
    
    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    // Create logo element
    const logoElement = config.branding.logo 
        ? `<img src="${config.branding.logo}" alt="${config.branding.name}">`
        : config.branding.name.substring(0, 2).toUpperCase();
    
    const newConversationHTML = `
        <div class="welcome-view">
            <div class="brand-header">
                <div class="logo">${logoElement}</div>
                <div class="info">
                    <h3>${config.branding.name}</h3>
                    <p>${config.branding.responseTimeText}</p>
                </div>
                <button class="close-button">×</button>
            </div>
            <div class="new-conversation">
                <h2 class="welcome-text">${config.branding.welcomeText}</h2>
                <button class="new-chat-btn">
                    <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                    </svg>
                    Send us a message
                </button>
                <p class="response-text">${config.branding.responseTimeText}</p>
            </div>
        </div>
    `;
    
    const chatInterfaceHTML = `
        <div class="chat-view">
            <div class="brand-header">
                <div class="logo">${logoElement}</div>
                <div class="info">
                    <h3>${config.branding.name}</h3>
                    <p>${config.branding.responseTimeText}</p>
                </div>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <div class="input-container">
                    <textarea placeholder="Type your message here..." rows="1"></textarea>
                    <button class="send-button">→</button>
                </div>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    const chatContainerHTML = `
        <div class="chat-content">
            ${newConversationHTML}
            ${chatInterfaceHTML}
        </div>
    `;
    
    chatContainer.innerHTML = chatContainerHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = '💬';
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);
    
    // Get elements
    const welcomeView = chatContainer.querySelector('.welcome-view');
    const chatView = chatContainer.querySelector('.chat-view');
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('.send-button');
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    
    // Auto-resize textarea
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];
        
        try {
            // Switch views immediately
            welcomeView.classList.add('hidden');
            chatView.classList.add('active');
            
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const responseData = await response.json();
            
            // Add initial bot message
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            messagesContainer.appendChild(botMessageDiv);
            
            // Scroll to bottom
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 50);
            
        } catch (error) {
            console.error('Error:', error);
            // Still switch views even on error
            welcomeView.classList.add('hidden');
            chatView.classList.add('active');
        }
    }
    
    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };
        
        // Add user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            
            // Add bot response
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    // Event listeners
    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
            textarea.style.height = 'auto';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
                textarea.style.height = 'auto';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });
    
    // Close button handlers
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
})();
