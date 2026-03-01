#!/usr/bin/env python3
"""
Test Flask app startup and meal scanner endpoint
"""
import os
import sys
import json
import base64
from io import BytesIO
from PIL import Image

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

def create_test_image():
    """Create a simple test image"""
    # Create a simple colored image
    img = Image.new('RGB', (100, 100), color='red')
    
    # Convert to base64
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    img_bytes = buffer.getvalue()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')
    
    return f"data:image/jpeg;base64,{img_base64}"

def test_flask_import():
    """Test if Flask app can be imported"""
    print("Testing Flask app import...")
    
    try:
        from app import app
        print("[OK] Flask app imported successfully")
        return True
    except Exception as e:
        print(f"[FAIL] Flask app import failed: {e}")
        return False

def test_routes_import():
    """Test if routes can be imported"""
    print("Testing routes import...")
    
    try:
        import routes
        print("[OK] Routes imported successfully")
        return True
    except Exception as e:
        print(f"[FAIL] Routes import failed: {e}")
        return False

def test_analyze_food_endpoint():
    """Test the analyze_food endpoint"""
    print("Testing /analyze_food endpoint...")
    
    try:
        from app import app
        
        # Create test client
        with app.test_client() as client:
            # Create test image
            test_image = create_test_image()
            
            # Make request
            response = client.post('/analyze_food', 
                                 json={'image': test_image},
                                 content_type='application/json')
            
            print(f"Response status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.get_json()
                if data.get('success'):
                    print("[OK] Endpoint returned success")
                    print(f"Foods detected: {len(data.get('foods', []))}")
                    return True
                else:
                    print(f"[FAIL] Endpoint returned error: {data.get('error')}")
                    return False
            else:
                print(f"[FAIL] HTTP error {response.status_code}: {response.get_data(as_text=True)}")
                return False
                
    except Exception as e:
        print(f"[FAIL] Endpoint test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=== Flask App Test Suite ===\n")
    
    tests = [
        test_flask_import,
        test_routes_import,
        test_analyze_food_endpoint
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
            print()  # Add spacing
        except Exception as e:
            print(f"[FAIL] Test {test.__name__} crashed: {e}")
            results.append(False)
            print()
    
    print("=== Test Results ===")
    print(f"Passed: {sum(results)}/{len(results)}")
    
    if all(results):
        print("[SUCCESS] All Flask tests passed! The meal scanner endpoint should work.")
    else:
        print("[ERROR] Some Flask tests failed. Check the errors above.")

if __name__ == "__main__":
    main()