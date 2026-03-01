import os
import logging
from flask import Flask

# Load environment variables from .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Create the application instance
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key')

# Configure Gemini API key from environment variable
# (set GEMINI_API_KEY in your .env file or system environment)
gemini_key = os.environ.get('GEMINI_API_KEY')
if gemini_key:
    logging.info('GEMINI_API_KEY configured successfully: %s...', gemini_key[:10])
else:
    logging.warning('GEMINI_API_KEY is not set! The AI chatbot will not work.')
app.config['GEMINI_API_KEY'] = gemini_key

# Make chat available on all routes
@app.context_processor
def inject_config():
    """Make configuration available to templates"""
    return {
        'config': {
            'GEMINI_API_KEY': app.config['GEMINI_API_KEY']
        },
        'show_chat': True,
        'enable_chat': True
    }

# Register error handlers
@app.errorhandler(404)
def page_not_found(e):
    return "Page not found", 404

@app.errorhandler(500)
def internal_server_error(e):
    return "Internal server error", 500

# Import routes
from routes import *

# Run the Flask app
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
