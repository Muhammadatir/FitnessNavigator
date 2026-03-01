#!/usr/bin/env python3
"""
Setup script to configure AI API for FitnessNavigator chatbot
"""

import os

def setup_api():
    print("FitnessNavigator AI Setup")
    print("=" * 30)
    
    # Read current .env file
    env_path = '.env'
    with open(env_path, 'r') as f:
        content = f.read()
    
    print("Choose AI Provider:")
    print("1. Local responses (no API key needed)")
    print("2. OpenAI ChatGPT (requires API key)")
    print("3. Google Gemini (requires API key)")
    
    choice = input("Enter choice (1-3): ").strip()
    
    if choice == '1':
        # Set to local
        content = content.replace('AI_PROVIDER=LOCAL', 'AI_PROVIDER=LOCAL')
        print("✅ Configured for local responses")
        
    elif choice == '2':
        # Set up OpenAI
        api_key = input("Enter your OpenAI API key: ").strip()
        if api_key:
            content = content.replace('OPENAI_API_KEY=your-openai-api-key-here', f'OPENAI_API_KEY={api_key}')
            content = content.replace('AI_PROVIDER=LOCAL', 'AI_PROVIDER=OPENAI')
            print("✅ Configured for OpenAI ChatGPT")
        else:
            print("❌ No API key provided")
            return
            
    elif choice == '3':
        # Set up Gemini
        api_key = input("Enter your Gemini API key: ").strip()
        if api_key:
            content = content.replace('GEMINI_API_KEY=your-gemini-api-key-here', f'GEMINI_API_KEY={api_key}')
            content = content.replace('AI_PROVIDER=LOCAL', 'AI_PROVIDER=GEMINI')
            print("✅ Configured for Google Gemini")
        else:
            print("❌ No API key provided")
            return
    else:
        print("❌ Invalid choice")
        return
    
    # Write back to .env
    with open(env_path, 'w') as f:
        f.write(content)
    
    print("\n🚀 Setup complete! You can now run the app with:")
    print("python app.py")

if __name__ == "__main__":
    setup_api()