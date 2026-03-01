import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Test the Gemini API key
api_key = os.environ.get('GEMINI_API_KEY')
print(f"API Key: {api_key[:10]}..." if api_key else "No API key found")

if api_key:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Test with a simple prompt
        response = model.generate_content("Say hello and confirm you're working")
        print("✅ Success! Gemini AI is working:")
        print(response.text)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nPossible issues:")
        print("1. Invalid API key")
        print("2. API key not activated")
        print("3. Quota exceeded")
        print("4. Network/firewall issues")
else:
    print("❌ No API key found in .env file")