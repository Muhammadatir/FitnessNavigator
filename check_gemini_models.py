#!/usr/bin/env python3
"""
Check available Gemini models for the current API key
"""
import os
import logging

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

def check_available_models():
    """Check which Gemini models are available"""
    try:
        import google.generativeai as genai
        
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            print("[ERROR] GEMINI_API_KEY not found")
            return
        
        print(f"[INFO] Using API key: {api_key[:10]}...")
        genai.configure(api_key=api_key)
        
        print("\n[INFO] Listing available models...")
        
        # List all available models
        models = genai.list_models()
        
        vision_models = []
        text_models = []
        
        for model in models:
            print(f"Model: {model.name}")
            print(f"  Display Name: {model.display_name}")
            print(f"  Supported Methods: {model.supported_generation_methods}")
            
            # Check if it supports generateContent and vision
            if 'generateContent' in model.supported_generation_methods:
                if 'vision' in model.name.lower() or 'flash' in model.name.lower():
                    vision_models.append(model.name)
                else:
                    text_models.append(model.name)
            print()
        
        print("=== SUMMARY ===")
        print(f"Vision-capable models: {vision_models}")
        print(f"Text-only models: {text_models}")
        
        # Test the first vision model
        if vision_models:
            test_model_name = vision_models[0]
            print(f"\n[INFO] Testing model: {test_model_name}")
            
            try:
                model = genai.GenerativeModel(test_model_name)
                print(f"[OK] Successfully initialized {test_model_name}")
                return test_model_name
            except Exception as e:
                print(f"[FAIL] Failed to initialize {test_model_name}: {e}")
        
        # Fallback to text models
        if text_models:
            test_model_name = text_models[0]
            print(f"\n[INFO] Testing fallback model: {test_model_name}")
            
            try:
                model = genai.GenerativeModel(test_model_name)
                print(f"[OK] Successfully initialized {test_model_name}")
                return test_model_name
            except Exception as e:
                print(f"[FAIL] Failed to initialize {test_model_name}: {e}")
        
        return None
        
    except Exception as e:
        print(f"[ERROR] Failed to check models: {e}")
        return None

def test_specific_models():
    """Test specific model names commonly used"""
    import google.generativeai as genai
    
    api_key = os.environ.get('GEMINI_API_KEY')
    genai.configure(api_key=api_key)
    
    test_models = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro-vision',
        'gemini-pro',
        'models/gemini-1.5-flash',
        'models/gemini-1.5-pro',
        'models/gemini-pro-vision',
        'models/gemini-pro'
    ]
    
    print("\n=== TESTING SPECIFIC MODELS ===")
    working_models = []
    
    for model_name in test_models:
        try:
            model = genai.GenerativeModel(model_name)
            print(f"[OK] {model_name} - SUCCESS")
            working_models.append(model_name)
        except Exception as e:
            print(f"[FAIL] {model_name} - {str(e)[:100]}...")
    
    print(f"\nWorking models: {working_models}")
    return working_models

if __name__ == "__main__":
    print("=== Gemini Model Checker ===")
    
    # Check available models
    best_model = check_available_models()
    
    # Test specific models
    working_models = test_specific_models()
    
    if working_models:
        print(f"\n[SUCCESS] Recommended model: {working_models[0]}")
    else:
        print("\n[ERROR] No working models found. Check your API key and internet connection.")