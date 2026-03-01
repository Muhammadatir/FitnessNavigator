import requests
import base64

# Test the food analysis API
def test_food_api():
    # Create a simple test image (1x1 pixel PNG)
    test_image_b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg=="
    
    url = "http://127.0.0.1:5002/analyze_food"
    
    payload = {
        "image": test_image_b64
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API is working!")
            print(f"Foods detected: {result.get('foods', [])}")
            print(f"Source: {result.get('source', 'Unknown')}")
        else:
            print("❌ API failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_food_api()