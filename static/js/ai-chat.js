class AIChat {
    constructor() {
        console.log('Initializing AI Chat...');
        this.container = null;
        this.messages = [];
        this.currentContext = {};
        try {
            this.init();
            console.log('AI Chat initialized successfully');
        } catch (error) {
            console.error('Error in AI Chat initialization:', error);
        }
    }

    init() {
        console.log('Creating chat interface...');
        this.createChatInterface();
        this.bindEvents();
        this.gatherPageContext();
        // Send initial greeting through server
        this.processMessage('hi');
        // Force show the chat interface after a short delay
        setTimeout(() => {
            const trigger = document.querySelector('.ai-chat-trigger');
            if (trigger) {
                console.log('Chat trigger found, making visible');
                trigger.style.display = 'flex';
            } else {
                console.log('Chat trigger not found');
            }
        }, 1000);
        console.log('Chat interface ready!');
    }

    createChatInterface() {
        // Create chat trigger button
        const trigger = document.createElement('div');
        trigger.className = 'ai-chat-trigger';
        trigger.innerHTML = '🤖';
        document.body.appendChild(trigger);

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
    }

    bindEvents() {
        // Toggle chat window
        const trigger = document.querySelector('.ai-chat-trigger');
        console.log('Chat trigger element:', trigger);
        
        trigger.addEventListener('click', (e) => {
            console.log('Chat trigger clicked');
            e.preventDefault();
            e.stopPropagation();
            this.container.classList.add('active');
            console.log('Added active class:', this.container.classList.contains('active'));
        });

        // Close chat window
        const closeBtn = this.container.querySelector('.ai-chat-close');
        closeBtn.addEventListener('click', (e) => {
            console.log('Close button clicked');
            e.preventDefault();
            e.stopPropagation();
            this.container.classList.remove('active');
        });

        // Send message
        const input = this.container.querySelector('input');
        const sendBtn = this.container.querySelector('button');
        
        const sendMessage = () => {
            const message = input.value.trim();
            if (message) {
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
    }

    gatherPageContext() {
        // Detect current page
        const currentPage = window.location.pathname;
        
        // Gather user data from various sources
        const userData = {};
        
        // Method 1: From list group items (user profile display)
        document.querySelectorAll('.list-group-item').forEach(elem => {
            const text = elem.textContent.trim();
            const badge = elem.querySelector('.badge');
            if (badge) {
                const label = text.replace(badge.textContent, '').trim();
                const value = badge.textContent.trim();
                if (label && value) {
                    userData[label] = value;
                }
            }
        });
        
        // Method 2: From form inputs (if on form page)
        document.querySelectorAll('input, select').forEach(input => {
            if (input.value && input.name) {
                userData[input.name] = input.value;
            }
        });
        
        // Method 3: From session storage or local storage
        try {
            const storedData = localStorage.getItem('fitnessUserData');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                Object.assign(userData, parsed);
            }
        } catch (e) {}

        // Gather workout plan data
        const workoutPlan = {};
        document.querySelectorAll('.accordion-item').forEach(item => {
            const button = item.querySelector('.accordion-button');
            if (button) {
                const buttonText = button.textContent.trim();
                const parts = buttonText.split('-');
                if (parts.length >= 2) {
                    const day = parts[0].trim();
                    const focus = parts[1].trim();
                    const exercises = Array.from(item.querySelectorAll('.list-group-item')).map(ex => {
                        return ex.textContent.trim();
                    });
                    workoutPlan[day] = { focus, exercises };
                }
            }
        });
        
        // Gather diet plan data
        const dietPlan = {};
        document.querySelectorAll('.card').forEach(card => {
            const title = card.querySelector('.card-title');
            if (title && title.textContent.includes('Day')) {
                const day = title.textContent.trim();
                const meals = {};
                card.querySelectorAll('.list-group-item').forEach(meal => {
                    const mealText = meal.textContent.trim();
                    const parts = mealText.split(':');
                    if (parts.length >= 2) {
                        meals[parts[0].trim()] = parts[1].trim();
                    }
                });
                dietPlan[day] = meals;
            }
        });
        
        // Gather visible page content for context
        const pageContent = {
            title: document.title,
            headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()),
            visibleText: this.getVisiblePageText()
        };
        
        // Gather BMI and health metrics if visible
        const healthMetrics = {};
        document.querySelectorAll('.progress-bar, .metric-value, .bmi-result').forEach(elem => {
            const label = elem.getAttribute('data-label') || elem.previousElementSibling?.textContent || 'metric';
            const value = elem.textContent.trim() || elem.getAttribute('data-value');
            if (value) {
                healthMetrics[label] = value;
            }
        });

        this.currentContext = { 
            userData, 
            workoutPlan, 
            dietPlan,
            healthMetrics,
            pageContent,
            currentPage 
        };
        
        console.log('Gathered context:', this.currentContext);
    }
    
    getVisiblePageText() {
        // Get key visible text from the page for context
        const textElements = document.querySelectorAll('p, li, .card-text, .alert');
        const visibleTexts = [];
        
        textElements.forEach(elem => {
            if (elem.offsetParent !== null && elem.textContent.trim().length > 10) {
                visibleTexts.push(elem.textContent.trim().substring(0, 100));
            }
        });
        
        return visibleTexts.slice(0, 5); // Limit to first 5 relevant texts
    }

    async processMessage(message) {
        console.log('Processing message:', message);
        
        // Refresh context before each message
        this.gatherPageContext();
        console.log('Current context:', this.currentContext);
        
        const loadingId = this.addMessage('loading', 'Thinking...');
        
        try {
            console.log('Sending request to /chat endpoint...');
            const requestBody = {
                message: message,
                context: this.currentContext
            };
            console.log('Request body:', requestBody);
            
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error text:', errorText);
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.error) {
                throw new Error(data.error);
            }
            if (!data.response) {
                throw new Error('Invalid response format from AI');
            }

            const aiResponse = data.response;
            console.log('AI response:', aiResponse);
            this.removeMessage(loadingId);
            this.addMessage('ai', aiResponse);
        } catch (error) {
            console.error('Chat Error Details:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });
            this.removeMessage(loadingId);
            
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            
            // Check if it's a network error
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message.includes('401')) {
                errorMessage = 'API key error. Please check your configuration.';
            } else if (error.message.includes('429')) {
                errorMessage = 'Too many requests. Please try again in a moment.';
            } else if (error.message.includes('500')) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            console.log('Showing error message:', errorMessage);
            this.addMessage('ai', errorMessage);
        }
    }

    addMessage(type, content) {
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
        return messageId;
    }

    removeMessage(messageId) {
        const message = document.getElementById(messageId);
        if (message) {
            message.remove();
        }
    }
}

// Initialize AI Chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM Content Loaded - Initializing chat...');
        window.aiChat = new AIChat();
        console.log('Chat initialization complete');
    } catch (error) {
        console.error('Error initializing chat:', error);
    }
});
