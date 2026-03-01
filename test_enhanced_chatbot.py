#!/usr/bin/env python3
"""
Test script for the enhanced AI chatbot functionality
Demonstrates context-aware and creative responses
"""

from routes import get_ai_response
import json

def test_chatbot():
    print("Enhanced FitnessNavigator AI Chatbot Test")
    print("=" * 50)
    
    # Test context data
    sample_context = {
        'userData': {
            'Age': '28',
            'Gender': 'female',
            'BMI': '22.5 (Normal weight)',
            'Food Preference': 'vegetarian',
            'Height': '165 cm',
            'Weight': '60 kg'
        },
        'workoutPlan': {
            'Monday': {
                'focus': 'Upper Body',
                'exercises': ['Push-ups', 'Pull-ups', 'Shoulder press']
            },
            'Tuesday': {
                'focus': 'Lower Body', 
                'exercises': ['Squats', 'Lunges', 'Deadlifts']
            }
        },
        'currentPage': '/diet_plan'
    }
    
    # Test various message types
    test_messages = [
        ("hello", "Greeting with context"),
        ("I need help with my diet", "Diet-related query"),
        ("How can I improve my workout?", "Workout improvement"),
        ("I'm feeling stressed", "Mental health topic"),
        ("I don't have much time to exercise", "Time management"),
        ("I've hit a plateau", "Progress concerns"),
        ("Tell me about quantum physics", "Completely unrelated topic"),
        ("What about the weather?", "Weather-related fitness"),
        ("I'm tired all the time", "Energy concerns"),
        ("How do I stay motivated?", "Motivation question")
    ]
    
    print("Testing responses with user context:")
    print(f"User: {sample_context['userData']['Age']} year old {sample_context['userData']['Gender']}")
    print(f"BMI: {sample_context['userData']['BMI']}")
    print(f"Diet: {sample_context['userData']['Food Preference']}")
    print("-" * 50)
    
    for message, description in test_messages:
        print(f"\nTest: {description}")
        print(f"User: {message}")
        response = get_ai_response(message, sample_context)
        print(f"AI: {response}")
        print("-" * 30)
    
    print("\nTesting without context (creative responses):")
    print("-" * 50)
    
    no_context_messages = [
        "Tell me about fitness",
        "What's the meaning of life?",
        "How do I become successful?",
        "What about artificial intelligence?"
    ]
    
    for message in no_context_messages:
        print(f"\nUser: {message}")
        response = get_ai_response(message, None)
        print(f"AI: {response}")
        print("-" * 30)

if __name__ == "__main__":
    test_chatbot()