import google.generativeai as genai

# Test the API key directly
api_key = "AIzaSyC1wsL0c3EtCY6R42dDeVPoxa5CKbcfj0w"

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, are you working?")
    print("SUCCESS:", response.text)
except Exception as e:
    print("ERROR:", str(e))