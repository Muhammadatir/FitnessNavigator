from app import app
import json

def test_chat():
    with app.test_client() as client:
        # Test basic chat
        response = client.post('/chat', 
                             json={'message': 'hi'},
                             content_type='application/json')
        print('Status:', response.status_code)
        print('Response:', response.get_json())
        
        # Test workout question
        response2 = client.post('/chat', 
                              json={'message': 'What do you think of my workout plan?'},
                              content_type='application/json')
        print('\nStatus 2:', response2.status_code)
        print('Response 2:', response2.get_json())

if __name__ == "__main__":
    test_chat()