console.log('AI Chat Debug Script Loaded');

class AIChat {
    constructor() {
        console.log('AI Chat Constructor Called');
        if (!window.env?.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY not found in environment');
            return;
        }
        this.container = null;
        this.messages = [];
        this.currentContext = {};
        this.init();
    }

    init() {
        console.log('Initializing AI Chat...');
        this.createChatInterface();
        this.bindEvents();
        this.gatherPageContext();
        this.addMessage('ai', 'Hi! I\'m your AI Fitness Assistant. I can help you with your workout and diet plans. What would you like to know?');
        console.log('AI Chat Initialized');
    }

    createChatInterface() {
        console.log('Creating Chat Interface...');
        
        // Create chat trigger button
        const trigger = document.createElement('div');
        trigger.className = 'ai-chat-trigger';
        trigger.innerHTML = '🤖';
        document.body.appendChild(trigger);
        console.log('Chat Trigger Created');

        // Create chat container
        const container = document.createElement('div');
        container.className = 'ai-chat-container';
        container.innerHTML = `
            <div class="ai-chat-header">
                <h3>AI Fitness Assistant</h3>
                <button class="ai-chat-close">×</button>
            </div>
            <div class="ai-chat-messages"></div>
            <div class="ai-chat-input">
                <input type="text" placeholder="Ask me anything about your fitness plan...">
                <button>Send</button>
            </div>
        `;
        document.body.appendChild(container);
        this.container = container;
        console.log('Chat Container Created');
    }    bindEvents() {
        console.log('Binding Events...');
        
        // Toggle chat window
        const trigger = document.querySelector('.ai-chat-trigger');
        console.log('Found Trigger:', trigger);
        
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                console.log('Trigger Clicked');
                e.preventDefault();
                e.stopPropagation();
                if (this.container) {
                    this.container.classList.add('active');
                    console.log('Added Active Class');
                }
            });
        }

        // Close chat window
        if (this.container) {
            const closeBtn = this.container.querySelector('.ai-chat-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    console.log('Close Button Clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    this.container.classList.remove('active');
                });
            }
        }

        // Send message
        const input = this.container.querySelector('input');
        const sendBtn = this.container.querySelector('button:not(.ai-chat-close)');
        
        const sendMessage = () => {
            console.log('Attempting to send message...');
            const message = input.value.trim();
            if (message) {
                console.log('Sending message:', message);
                this.addMessage('user', message);
                this.processMessage(message);
                input.value = '';
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        console.log('Message handlers bound');
    }

    gatherPageContext() {
        console.log('Gathering page context...');
        // Gather user data
        const userDataElements = document.querySelectorAll('.list-group-item');
        const userData = {};
        userDataElements.forEach(elem => {
            const label = elem.textContent.split('\n')[0].trim();
            const value = elem.querySelector('.badge')?.textContent.trim();
            if (value) {
                userData[label] = value;
            }
        });

        // Gather workout plan
        const workoutPlan = {};
        document.querySelectorAll('.accordion-item').forEach(item => {
            const day = item.querySelector('.accordion-button').textContent.split('-')[0].trim();
            const focus = item.querySelector('.accordion-button').textContent.split('-')[1].trim();
            const exercises = Array.from(item.querySelectorAll('.list-group-item')).map(ex => {
                return ex.textContent.trim();
            });
            workoutPlan[day] = { focus, exercises };
        });

        this.currentContext = { userData, workoutPlan };
        console.log('Page context gathered:', this.currentContext);
    }

    addMessage(type, content) {
        console.log('Adding message:', { type, content });
        const messagesContainer = this.container.querySelector('.ai-chat-messages');
        const messageDiv = document.createElement('div');
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        messageDiv.id = messageId;
        messageDiv.className = `ai-chat-message ${type}`;
        
        if (type === 'loading') {
            messageDiv.innerHTML = `${content}<span class="loading-dots"></span>`;
        } else {
            messageDiv.textContent = content;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        console.log('Message added with ID:', messageId);
        return messageId;
    }

    removeMessage(messageId) {
        console.log('Removing message:', messageId);
        const message = document.getElementById(messageId);
        if (message) {
            message.remove();
            console.log('Message removed');
        } else {
            console.log('Message not found');
        }
   }    async processMessage(message) {
        console.log('Processing message:', message);
        const loadingId = this.addMessage('loading', 'Thinking...');
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log('Received API response:', data);

            if (data.error) {
                throw new Error(data.error);
            }

            this.removeMessage(loadingId);
            this.addMessage('ai', data.response);
        } catch (error) {
            console.error('Error processing message:', error);
            this.removeMessage(loadingId);
            this.addMessage('ai', 'Sorry, I encountered an error. Please try again later.');
        }
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
} else {
    initChat();
}

function initChat() {
    console.log('Initializing Chat...');
    try {
        window.aiChat = new AIChat();
        console.log('Chat Initialized Successfully');
    } catch (error) {
        console.error('Error Initializing Chat:', error);
    }
}
