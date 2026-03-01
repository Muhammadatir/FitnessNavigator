#!/usr/bin/env python3
"""
Test script for meal scanner functionality
"""
import os
import sys
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)

def test_imports():
    """Test if all required imports work"""
    print("Testing imports...")
    
    try:
        import google.generativeai as genai
        print("[OK] google-generativeai imported successfully")
    except ImportError as e:
        print(f"[FAIL] google-generativeai import failed: {e}")
        print("  Run: pip install google-generativeai")
        return False
    
    try:
        from PIL import Image
        print("[OK] PIL (Pillow) imported successfully")
    except ImportError as e:
        print(f"[FAIL] PIL import failed: {e}")
        print("  Run: pip install Pillow")
        return False
    
    try:
        from food_recognition import FoodRecognitionAPI
        print("[OK] FoodRecognitionAPI imported successfully")
    except ImportError as e:
        print(f"[FAIL] FoodRecognitionAPI import failed: {e}")
        return False
    
    return True

def test_api_key():
    """Test if API key is configured"""
    print("\nTesting API key configuration...")
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        print("[FAIL] GEMINI_API_KEY not found in environment")
        print("  Please set GEMINI_API_KEY in your .env file")
        return False
    
    if len(api_key) < 20:
        print("[FAIL] GEMINI_API_KEY appears to be invalid (too short)")
        return False
    
    print(f"[OK] GEMINI_API_KEY found: {api_key[:10]}...")
    return True

def test_food_recognition_init():
    """Test FoodRecognitionAPI initialization"""
    print("\nTesting FoodRecognitionAPI initialization...")
    
    try:
        from food_recognition import FoodRecognitionAPI
        api = FoodRecognitionAPI()
        
        if api.nutrition_model:
            print("[OK] Gemini AI model initialized successfully")
            return True
        else:
            print("[FAIL] Gemini AI model not initialized")
            return False
            
    except Exception as e:
        print(f"[FAIL] FoodRecognitionAPI initialization failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=== Meal Scanner Test Suite ===\n")
    
    # Load environment variables
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("[OK] Environment variables loaded")
    except ImportError:
        print("[INFO] python-dotenv not available, using system environment")
    
    tests = [
        test_imports,
        test_api_key,
        test_food_recognition_init
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"[FAIL] Test {test.__name__} crashed: {e}")
            results.append(False)
    
    print(f"\n=== Test Results ===")
    print(f"Passed: {sum(results)}/{len(results)}")
    
    if all(results):
        print("[SUCCESS] All tests passed! Meal scanner should work properly.")
    else:
        print("[ERROR] Some tests failed. Please fix the issues above.")
        print("\nCommon fixes:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Set GEMINI_API_KEY in .env file")
        print("3. Ensure you have a valid Google AI API key")

if __name__ == "__main__":
    main()