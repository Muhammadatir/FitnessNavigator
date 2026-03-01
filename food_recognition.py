import requests
import base64
from io import BytesIO
from PIL import Image
import json
import os
import logging

try:
    import google.generativeai as genai
except ImportError:
    genai = None
    logging.warning("google-generativeai not installed. Install with: pip install google-generativeai")

class FoodRecognitionAPI:
    def __init__(self):
        # Google APIs configuration
        self.google_api_key = os.environ.get('GOOGLE_VISION_API_KEY') or os.environ.get('GEMINI_API_KEY')
        self.food_provider = os.environ.get('FOOD_API_PROVIDER', 'GOOGLE')
        
        # Initialize Gemini for nutrition analysis
        self.gemini_key = os.environ.get('GEMINI_API_KEY')
        self.nutrition_model = None
        
        if self.gemini_key and genai:
            try:
                genai.configure(api_key=self.gemini_key)
                # Try different model names in order of preference
                model_names = ['gemini-1.5-flash', 'gemini-pro-vision', 'gemini-pro']
                
                for model_name in model_names:
                    try:
                        self.nutrition_model = genai.GenerativeModel(model_name)
                        logging.info(f"Gemini AI initialized successfully with model: {model_name}")
                        break
                    except Exception as model_error:
                        logging.warning(f"Failed to initialize {model_name}: {model_error}")
                        continue
                
                if not self.nutrition_model:
                    raise Exception("No compatible Gemini model found")
            except Exception as e:
                logging.error(f"Failed to initialize Gemini AI: {e}")
                self.nutrition_model = None
        else:
            if not self.gemini_key:
                logging.warning("GEMINI_API_KEY not found in environment variables")
            if not genai:
                logging.warning("google-generativeai library not available")
        
    def analyze_food_image(self, image_data):
        """
        Analyze food image using Gemini AI with proper error handling
        """
        if not self.google_api_key:
            raise Exception("No GEMINI_API_KEY configured. Please set your API key in the .env file.")
        
        if not genai:
            raise Exception("google-generativeai library not installed. Run: pip install google-generativeai")
        
        try:
            # Force use of Gemini AI for real image analysis
            logging.info("Starting Gemini AI food recognition...")
            result = self.google_food_recognition(image_data)
            logging.info(f"Gemini AI analysis successful: {len(result.get('foods', []))} foods detected")
            return result
            
        except Exception as e:
            logging.error(f"Gemini AI food recognition failed: {str(e)}")
            # Provide more specific error messages
            if "API_KEY" in str(e).upper():
                raise Exception("Invalid API key. Please check your GEMINI_API_KEY in the .env file.")
            elif "QUOTA" in str(e).upper() or "LIMIT" in str(e).upper():
                raise Exception("API quota exceeded. Please check your Gemini API usage limits.")
            else:
                raise Exception(f"AI analysis failed: {str(e)}. Please try a clearer image or check your internet connection.")
    
    def google_food_recognition(self, image_data):
        """
        Use Gemini AI for direct food recognition from images
        """
        try:
            from PIL import Image
            import io
            import base64
            
            # Use already configured Gemini from __init__
            if not self.nutrition_model:
                raise Exception("Gemini AI not properly initialized")
            
            # Convert base64 to PIL Image
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            try:
                image_bytes = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_bytes))
                
                # Preprocess image for better AI recognition
                image = self.preprocess_image(image)
                logging.info(f"Image processed: {image.size} pixels, mode: {image.mode}")
            except Exception as img_error:
                raise Exception(f"Invalid image data: {str(img_error)}")
            
            # Create detailed prompt for accurate food recognition
            prompt = """You are a professional food recognition expert. Analyze this food image very carefully and identify EXACTLY what you see.

IMPORTANT INSTRUCTIONS:
1. Look at the actual food items, colors, textures, and cooking methods
2. Be VERY specific about what you observe (e.g., "Butter Chicken Curry" not just "Chicken")
3. Consider the cuisine type, preparation method, and visual characteristics
4. Only identify foods you can clearly see - don't guess or assume
5. If you see rice, specify the type (white rice, biryani, fried rice, etc.)
6. For curries, identify the specific type based on color and ingredients visible
7. Confidence should reflect how certain you are about each identification

Provide your response in this EXACT JSON format:
{
    "foods": [
        {"name": "Specific Food Name", "confidence": 85},
        {"name": "Another Specific Food", "confidence": 92}
    ]
}

Examples of good specificity:
- "Chicken Biryani" instead of "Rice"
- "Paneer Butter Masala" instead of "Curry"
- "Tandoori Roti" instead of "Bread"
- "Dal Tadka" instead of "Lentils"

Analyze the image now and be as accurate as possible:"""
            
            # Generate response
            logging.info("Sending request to Gemini AI...")
            response = self.nutrition_model.generate_content([prompt, image])
            
            if response and response.text:
                logging.info(f"Received response from Gemini: {len(response.text)} characters")
                return self.process_gemini_food_response(response.text)
            else:
                raise Exception("Empty response from Gemini AI")
                
        except Exception as e:
            logging.error(f"Gemini food recognition failed: {e}")
            if "safety" in str(e).lower():
                raise Exception("Image was blocked by safety filters. Please try a different image.")
            elif "invalid" in str(e).lower() and "image" in str(e).lower():
                raise Exception("Invalid image format. Please use JPG or PNG images.")
            else:
                raise Exception(f"Gemini AI Error: {str(e)}")
    
    def preprocess_image(self, image):
        """
        Preprocess image for better AI recognition
        """
        try:
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize if too large (max 1024x1024 for better processing)
            max_size = 1024
            if image.width > max_size or image.height > max_size:
                image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                logging.info(f"Image resized to: {image.size}")
            
            # Enhance image quality if too small
            min_size = 300
            if image.width < min_size or image.height < min_size:
                # Calculate new size maintaining aspect ratio
                ratio = max(min_size / image.width, min_size / image.height)
                new_size = (int(image.width * ratio), int(image.height * ratio))
                image = image.resize(new_size, Image.Resampling.LANCZOS)
                logging.info(f"Image upscaled to: {image.size}")
            
            return image
            
        except Exception as e:
            logging.warning(f"Image preprocessing failed: {e}, using original")
            return image
    
    def process_gemini_food_response(self, response_text):
        """
        Process Gemini AI food recognition response
        """
        try:
            # Clean up response text
            response_text = response_text.strip()
            
            # Remove markdown formatting if present
            if '```' in response_text:
                parts = response_text.split('```')
                for part in parts:
                    if 'json' in part.lower() or '{' in part:
                        response_text = part.replace('json', '').strip()
                        break
            
            # Find JSON in the response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                food_data = json.loads(json_str)
                
                foods = food_data.get('foods', [])
                
                # Validate and clean food data
                cleaned_foods = []
                for food in foods:
                    if isinstance(food, dict) and 'name' in food and 'confidence' in food:
                        cleaned_foods.append({
                            'name': str(food['name']).title(),
                            'confidence': int(food['confidence'])
                        })
                
                if not cleaned_foods:
                    raise Exception("No valid food items found in response")
                
                # Calculate nutrition
                nutrition = self.calculate_nutrition_from_foods(cleaned_foods)
                
                return {
                    'foods': cleaned_foods,
                    'nutrition': nutrition,
                    'source': 'Gemini AI Vision'
                }
                
            else:
                raise Exception("No JSON found in response")
                
        except json.JSONDecodeError as e:
            logging.error(f"JSON decode error: {e}")
            logging.error(f"Full response text: {response_text}")
            # Try to extract food names from text if JSON parsing fails
            return self.extract_foods_from_text(response_text)
        except Exception as e:
            logging.error(f"Processing error: {e}")
            raise Exception(f"Failed to process Gemini response: {e}")
    
    def extract_foods_from_text(self, response_text):
        """
        Extract food names from text when JSON parsing fails
        """
        try:
            # Look for food-related keywords in the response
            import re
            
            # Common food patterns
            food_patterns = [
                r'chicken\s+\d+',  # Chicken 65, Chicken 999, etc.
                r'\b(?:fried|grilled|steamed|baked)\s+\w+',
                r'\b(?:biryani|curry|rice|naan|roti)\b',
                r'\b\w+\s+(?:chicken|mutton|fish|paneer)\b'
            ]
            
            found_foods = []
            text_lower = response_text.lower()
            
            # Extract potential food names
            for pattern in food_patterns:
                matches = re.findall(pattern, text_lower, re.IGNORECASE)
                for match in matches:
                    found_foods.append({
                        'name': match.title(),
                        'confidence': 80
                    })
            
            # If no patterns found, look for capitalized words (likely food names)
            if not found_foods:
                words = response_text.split()
                for word in words:
                    if word.istitle() and len(word) > 3:
                        found_foods.append({
                            'name': word,
                            'confidence': 75
                        })
            
            # Limit to 3 items
            found_foods = found_foods[:3]
            
            if found_foods:
                nutrition = self.calculate_nutrition_from_foods(found_foods)
                return {
                    'foods': found_foods,
                    'nutrition': nutrition,
                    'source': 'Gemini AI (Text Analysis)'
                }
            else:
                raise Exception("Could not extract food information from response")
                
        except Exception as e:
            logging.error(f"Text extraction failed: {e}")
            raise Exception(f"Failed to extract foods from text: {e}")
    
    def calculate_nutrition_from_foods(self, foods):
        """
        Calculate nutrition using Gemini AI or fallback to database
        """
        # Always try Gemini AI first for accurate nutrition analysis
        if self.nutrition_model:
            try:
                return self.gemini_nutrition_analysis(foods)
            except Exception as e:
                logging.warning(f"Gemini nutrition analysis failed: {e}")
        
        # Only use basic calculation if Gemini fails
        logging.info("Using basic nutrition calculation as fallback")
        return self.basic_nutrition_calculation(foods)
    
    def gemini_nutrition_analysis(self, foods):
        """
        Use Gemini AI to analyze nutrition from detected foods
        """
        food_list = [f"{food['name']} (confidence: {food['confidence']}%)" for food in foods]
        food_string = ", ".join(food_list)
        
        prompt = f"""Analyze the nutritional content of this meal/food items: {food_string}

Provide realistic nutritional estimates for a typical serving size. Consider the confidence levels - higher confidence items should have more weight in calculations.

Return ONLY a JSON object with this exact format:
{{
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
}}

Example: {{"calories": 420, "protein": 25, "carbs": 45, "fat": 12}}

Be realistic about portion sizes and nutritional values."""
        
        response = self.nutrition_model.generate_content(prompt)
        
        if response and response.text:
            try:
                # Extract JSON from response
                response_text = response.text.strip()
                # Remove any markdown formatting
                if '```' in response_text:
                    response_text = response_text.split('```')[1]
                    if response_text.startswith('json'):
                        response_text = response_text[4:]
                
                nutrition_data = json.loads(response_text)
                
                # Validate and round values
                validated_nutrition = {}
                for key in ['calories', 'protein', 'carbs', 'fat']:
                    if key in nutrition_data:
                        validated_nutrition[key] = round(float(nutrition_data[key]), 1)
                    else:
                        validated_nutrition[key] = 0.0
                
                return validated_nutrition
                
            except (json.JSONDecodeError, ValueError, KeyError) as e:
                print(f"Failed to parse Gemini nutrition response: {e}")
                raise Exception("Invalid nutrition response format")
        
        raise Exception("No response from Gemini")
    
    def basic_nutrition_calculation(self, foods):
        """
        Fallback nutrition calculation using basic database
        """
        # Simplified nutrition database for fallback
        nutrition_db = {
            'chicken': {'calories': 165, 'protein': 31, 'carbs': 0, 'fat': 3.6},
            'beef': {'calories': 250, 'protein': 26, 'carbs': 0, 'fat': 17},
            'fish': {'calories': 140, 'protein': 25, 'carbs': 0, 'fat': 5},
            'rice': {'calories': 130, 'protein': 2.7, 'carbs': 28, 'fat': 0.3},
            'pasta': {'calories': 220, 'protein': 8, 'carbs': 44, 'fat': 1.1},
            'bread': {'calories': 265, 'protein': 9, 'carbs': 49, 'fat': 3.2},
            'vegetable': {'calories': 25, 'protein': 2, 'carbs': 5, 'fat': 0.2},
            'fruit': {'calories': 50, 'protein': 0.5, 'carbs': 12, 'fat': 0.2}
        }
        
        total_nutrition = {'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0}
        
        for food in foods:
            food_name = food['name'].lower()
            confidence_factor = food['confidence'] / 100
            
            # Find matching nutrition data
            matched = False
            for key, nutrition in nutrition_db.items():
                if key in food_name or food_name in key:
                    portion_factor = confidence_factor * 1.2
                    
                    total_nutrition['calories'] += nutrition['calories'] * portion_factor
                    total_nutrition['protein'] += nutrition['protein'] * portion_factor
                    total_nutrition['carbs'] += nutrition['carbs'] * portion_factor
                    total_nutrition['fat'] += nutrition['fat'] * portion_factor
                    matched = True
                    break
            
            # If no match, use average values
            if not matched:
                avg_nutrition = {'calories': 150, 'protein': 8, 'carbs': 20, 'fat': 5}
                portion_factor = confidence_factor * 0.8
                
                total_nutrition['calories'] += avg_nutrition['calories'] * portion_factor
                total_nutrition['protein'] += avg_nutrition['protein'] * portion_factor
                total_nutrition['carbs'] += avg_nutrition['carbs'] * portion_factor
                total_nutrition['fat'] += avg_nutrition['fat'] * portion_factor
        
        # Round values
        for key in total_nutrition:
            total_nutrition[key] = round(total_nutrition[key], 1)
        
        return total_nutrition
    
    def enhanced_food_analysis(self, image_data):
        """
        Enhanced food analysis using image processing
        """
        # This would use computer vision libraries like OpenCV
        # For now, return realistic analysis based on common meals
        
        realistic_meals = [
            {
                'foods': [
                    {'name': 'Grilled Chicken Breast', 'confidence': 94},
                    {'name': 'Steamed Rice', 'confidence': 89},
                    {'name': 'Mixed Vegetables', 'confidence': 92}
                ],
                'nutrition': {'calories': 420, 'protein': 35, 'carbs': 38, 'fat': 8}
            },
            {
                'foods': [
                    {'name': 'Salmon Fillet', 'confidence': 91},
                    {'name': 'Quinoa', 'confidence': 87},
                    {'name': 'Green Salad', 'confidence': 95}
                ],
                'nutrition': {'calories': 380, 'protein': 28, 'carbs': 32, 'fat': 12}
            },
            {
                'foods': [
                    {'name': 'Spaghetti Pasta', 'confidence': 96},
                    {'name': 'Tomato Sauce', 'confidence': 88},
                    {'name': 'Ground Beef', 'confidence': 85}
                ],
                'nutrition': {'calories': 520, 'protein': 22, 'carbs': 68, 'fat': 16}
            }
        ]
        
        import random
        selected_meal = random.choice(realistic_meals)
        selected_meal['source'] = 'Fallback Analysis'
        return selected_meal
    
    def basic_food_analysis(self):
        """
        Basic fallback analysis
        """
        return {
            'foods': [
                {'name': 'Mixed Meal', 'confidence': 85}
            ],
            'nutrition': {'calories': 350, 'protein': 20, 'carbs': 30, 'fat': 12},
            'source': 'Basic Analysis'
        }

# Usage example:
# food_ai = FoodRecognitionAPI()
# result = food_ai.analyze_food_image(image_data)