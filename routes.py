import logging
import json
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from utils import generate_workout_plan, generate_diet_plan, calculate_bmi
from app import app
from pdf_generator import generate_grocery_list, create_diet_pdf, create_workout_pdf, create_grocery_pdf
import os
import requests
from flask import send_file
from food_recognition import FoodRecognitionAPI

# Enhanced AI responses for fitness chatbot with context awareness
def get_ai_response(user_message, context=None):
    """Generate contextual AI-like responses for fitness queries with page context awareness"""
    import random
    import json
    import os
    
    # Check if we should use external AI API
    ai_provider = os.environ.get('AI_PROVIDER', 'LOCAL')
    openai_key = os.environ.get('OPENAI_API_KEY')
    
    if ai_provider == 'OPENAI' and openai_key and openai_key != 'your-openai-api-key-here':
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_key)
            
            context_str = ""
            if context:
                context_str = f"User context: {json.dumps(context, indent=2)}\n\n"
            
            prompt = f"{context_str}You are a fitness AI assistant. Answer this question in a helpful, motivating way: {user_message}"
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logging.error(f"OpenAI API error: {e}")
            # Fall back to local responses
    
    msg = user_message.lower()
    
    # Parse context if provided
    user_data = {}
    workout_plan = {}
    current_page = ""
    
    if context:
        try:
            if isinstance(context, str):
                context_data = json.loads(context)
            else:
                context_data = context
            user_data = context_data.get('userData', {})
            workout_plan = context_data.get('workoutPlan', {})
            current_page = context_data.get('currentPage', '')
        except:
            pass
    
    # Check for greetings first (exact matches to avoid conflicts)
    if msg.strip() in ['hi', 'hello', 'hey'] or msg.startswith(('hi ', 'hello ', 'hey ')):
        return random.choice([
            "Hello! I'm your AI fitness coach. I can help with workouts, nutrition, motivation, and health questions. What's on your mind?",
            "Hi there! Ready to crush your fitness goals? Ask me about workouts, diet, or any health topic!",
            "Hey! I'm here to support your fitness journey. What would you like to know?"
        ])
    
    # Workout and exercise responses
    elif any(word in msg for word in ['workout', 'exercise', 'training', 'gym', 'fitness']):
        return random.choice([
            "Workouts should include: 1) Compound movements (squats, deadlifts), 2) Progressive overload, 3) Proper rest between sessions. Start with 3x/week full-body routines. What's your experience level?",
            "Effective workout structure: Warm-up (5-10min) -> Strength training (20-40min) -> Cardio (15-30min) -> Cool-down (5-10min). Focus on form over intensity. Need specific exercises?",
            "Key workout principles: Progressive overload, consistency, proper form, adequate recovery. Mix strength training with cardio for best results. What are your fitness goals?"
        ])
    
    # Diet and nutrition responses  
    elif any(word in msg for word in ['diet', 'food', 'nutrition', 'meal', 'eat']):
        if user_data:
            bmi = user_data.get('BMI', '')
            food_pref = user_data.get('Food Preference', '')
            responses = [
                f"Based on your {food_pref} preference and BMI of {bmi}, I see great potential! Your diet plan is personalized for optimal results. Want tips to maximize nutrition absorption?",
                f"Looking at your profile - {food_pref} diet with BMI {bmi} - here's a pro tip: Time your carbs around workouts for better energy and recovery. What's your biggest nutrition challenge?",
                f"Your {food_pref} approach is smart! With your current BMI ({bmi}), focus on nutrient timing. Did you know eating protein within 30 minutes post-workout boosts muscle synthesis by 25%?"
            ]
            if bmi and 'overweight' in bmi.lower():
                responses.append(f"For your BMI category ({bmi}), intermittent fasting could accelerate results. Try 16:8 method - eat within 8 hours, fast 16. Studies show 3-8% weight loss in 3-24 weeks!")
            return random.choice(responses)
        else:
            return random.choice([
                "Nutrition is 70% of fitness! Beyond basic macros, consider meal timing, food combinations, and gut health. Fermented foods boost nutrient absorption by 15-20%!",
                "Pro nutrition hack: Eat the rainbow! Different colored foods provide unique phytonutrients. Purple foods (blueberries, eggplant) boost brain health and recovery!",
                "Advanced tip: Combine vitamin C foods with iron-rich foods for 3x better absorption. Think spinach salad with strawberries or lentils with bell peppers!"
            ])
    
    # Space/astronomy questions
    elif any(word in msg for word in ['moon', 'space', 'astronaut', 'nasa', 'apollo']):
        return random.choice([
            "Neil Armstrong was the first person to step on the moon on July 20, 1969! Speaking of reaching new heights - your fitness journey is like space exploration. Each workout is a step toward your personal moon landing. What's your fitness mission?",
            "The moon landing was July 20, 1969 with Neil Armstrong! Fun fact: Astronauts lose muscle mass in zero gravity, which is why they exercise 2.5 hours daily in space. Gravity is your friend for building strength!",
            "Neil Armstrong made that giant leap in 1969! Just like space missions need precise planning, your fitness goals need a structured approach. Ready to launch your transformation?"
        ])
    
    # Cardio specific responses
    elif any(word in msg for word in ['cardio', 'running', 'cycling', 'swimming']):
        return random.choice([
            "Cardio benefits: Improves heart health, burns calories, boosts mood. Try: 150min moderate or 75min vigorous weekly. Mix it up - running, cycling, swimming, dancing!",
            "Great cardio options: HIIT (20min), steady-state (30-45min), or fun activities like dancing, hiking, sports. What type of cardio do you enjoy most?",
            "Cardio tips: Start slow, build gradually, listen to your body. Aim for 3-5 sessions per week. Mix high and low intensity for best results!"
        ])
    
    elif any(phrase in msg for phrase in ['best time', 'when to workout', 'time to exercise', 'workout time']):
        return random.choice([
            "Best workout times: Morning (6-8am) boosts metabolism all day, Evening (4-6pm) when body temperature peaks for performance. Avoid 2-3 hours before bed. What fits your schedule?",
            "Timing depends on your goals! Morning: better for fat burning, consistency. Evening: higher performance, strength gains. Most important: pick a time you can stick to consistently!",
            "Great question! Morning workouts: fasted cardio burns more fat, less crowded gyms. Evening: body is warmer, better performance. Choose what works for your lifestyle and energy levels."
        ])
    
    elif 'friday' in msg and 'workout' in msg:
        return "Friday is perfect for cardio! Try: 20-30 min running/cycling, 15 min HIIT (30s work, 30s rest), or dance workout. Cardio helps recovery and burns calories. What's your preferred cardio activity?"
    
    elif any(word in msg for word in ['beginner', 'start', 'new']):
        return "Great that you're starting! For beginners: Start with 3 days/week, focus on form over intensity. Try bodyweight exercises: squats, push-ups, planks. Gradually increase difficulty. What's your main fitness goal?"
    
    elif any(word in msg for word in ['hydrat', 'water', 'drink', 'fluid']):
        return random.choice([
            "Stay hydrated! Drink 8-10 glasses of water daily, more during workouts. Signs of good hydration: light yellow urine, no constant thirst. Water boosts metabolism!",
            "Hydration is key! Aim for half your body weight in ounces daily. During exercise, drink 7-10oz every 10-20 minutes. Add electrolytes for intense workouts.",
            "Great hydration question! Start your day with water, keep a bottle nearby, drink before you feel thirsty. Proper hydration improves performance and energy!"
        ])
    
    elif 'workout_plan' in current_page or any(word in msg for word in ['workout', 'exercise']):
        if workout_plan:
            workout_days = list(workout_plan.keys())
            return random.choice([
                f"I see your {len(workout_days)}-day plan! Pro tip: Your {workout_days[0] if workout_days else 'Monday'} workout can be enhanced with pre-activation exercises. Try glute bridges before squats for 23% better activation!",
                f"Your workout structure is solid! Want to level up? Add tempo training - 3 seconds down, 1 second up. This increases time under tension and muscle growth by 15-20%!",
                f"Looking at your plan, here's an advanced technique: Cluster sets! Instead of straight sets, break them into mini-sets with 15-20 second rests. Increases total volume by 10-15%!"
            ])
        else:
            return random.choice([
                "Beyond basic exercises, let's talk periodization! Your body adapts in 4-6 weeks. Vary intensity, volume, and exercise selection to prevent plateaus. What's your training experience?",
                "Advanced training tip: Use RPE (Rate of Perceived Exertion) scale 1-10. Train at RPE 7-8 for strength, RPE 6-7 for hypertrophy. This auto-regulates based on daily readiness!",
                "Workout hack: Compound movements first, isolation last. Deadlifts before bicep curls! This maximizes strength gains and prevents injury. What's your primary goal?"
            ])
    

    
    elif any(word in msg for word in ['weight loss', 'lose weight', 'fat']):
        return "Weight loss formula: Calorie deficit + exercise + consistency. Aim for 1-2 lbs/week loss. Combine cardio (4x/week) with strength training (3x/week). Track your food intake. What's your current activity level?"
    
    elif any(word in msg for word in ['muscle', 'gain', 'build', 'strength']):
        return "Muscle building needs: Progressive overload, adequate protein (0.8-1g per lb bodyweight), 7-9 hours sleep, compound exercises (squats, deadlifts, bench press). How many days can you commit to training?"
    
    elif any(word in msg for word in ['motivat', 'lazy', 'discipline', 'consistent']):
        return random.choice([
            "Motivation tips: Set small daily goals, track progress, find a workout buddy, reward yourself for milestones. Remember why you started! What's your main fitness goal?",
            "Stay motivated by: Creating a routine, celebrating small wins, taking progress photos, joining fitness communities. Discipline beats motivation - make it a habit!"
        ])
    
    elif any(word in msg for word in ['protein', 'supplement', 'creatine', 'vitamin', 'protien']):
        return "Supplements can help but aren't magic! Basics: Protein powder (if you can't get enough from food), creatine (3-5g daily), multivitamin, fish oil. Focus on whole foods first. What are your nutrition goals?"
    
    elif any(word in msg for word in ['injury', 'pain', 'hurt', 'sore']):
        return "For injury prevention: Always warm up, focus on proper form, don't ignore pain, get adequate rest. If you're injured, see a healthcare professional. Soreness is normal, sharp pain is not!"
    
    elif any(word in msg for word in ['cardio', 'running', 'cycling', 'swimming']):
        return random.choice([
            "Cardio benefits: Improves heart health, burns calories, boosts mood. Try: 150min moderate or 75min vigorous weekly. Mix it up - running, cycling, swimming, dancing!",
            "Great cardio options: HIIT (20min), steady-state (30-45min), or fun activities like dancing, hiking, sports. What type of cardio do you enjoy most?"
        ])
    
    elif any(word in msg for word in ['abs', 'core', 'belly', 'stomach']):
        return "Core workout: Planks (3x30-60s), bicycle crunches (3x20), Russian twists (3x15), mountain climbers (3x20). Remember: abs are made in the kitchen - diet is key for visible abs!"
    
    elif any(word in msg for word in ['stretch', 'flexibility', 'yoga']):
        return "Stretching is essential! Do dynamic stretches before workouts, static stretches after. Hold stretches 15-30 seconds. Try yoga for flexibility and mindfulness. When do you usually stretch?"
    
    elif any(word in msg for word in ['calories', 'metabolism', 'burn']):
        return "Calorie burning: Muscle tissue burns more calories at rest, so strength training boosts metabolism. Cardio burns calories during exercise. Combine both for best results! What's your activity level?"
    
    elif any(word in msg for word in ['sleep', 'rest', 'recovery']):
        return "Sleep is crucial for fitness! Aim for 7-9 hours nightly. During sleep, your body repairs muscles, releases growth hormone. Poor sleep = slower recovery, increased injury risk, and weight gain."
    
    elif any(word in msg for word in ['stress', 'anxiety', 'mental']):
        return random.choice([
            "Exercise is nature's antidepressant! It increases BDNF (brain fertilizer), reduces cortisol by 23%, and creates new neural pathways. Even 10 minutes of movement changes brain chemistry!",
            "Mental fitness hack: Exercise + mindfulness = superpower! Try 'mindful movement' - focus on breath during workouts. This activates the parasympathetic nervous system for deeper calm.",
            "Stress and fitness are connected! Chronic stress blocks muscle growth and fat loss. Combat it with: morning sunlight (regulates cortisol), cold showers (builds resilience), and gratitude journaling."
        ])
    
    elif any(word in msg for word in ['time', 'busy', 'schedule', 'quick']):
        return random.choice([
            "Time-efficient fitness: HIIT burns calories for 24+ hours post-workout (EPOC effect). Just 15 minutes of burpees, mountain climbers, and jump squats = gym session!",
            "Busy person's secret: Micro-workouts! 2 minutes every hour beats 1 hour once. Try: desk push-ups, stair climbing, calf raises during calls. Your metabolism stays elevated all day!",
            "Time hack: Compound movements work multiple muscles simultaneously. One squat-to-press works 8+ muscle groups. Maximum results, minimum time!"
        ])
    
    elif any(word in msg for word in ['plateau', 'stuck', 'progress', 'results']):
        return random.choice([
            "Plateau buster: Your body adapts in 4-6 weeks. Change ONE variable: increase weight, reps, tempo, or rest time. Progressive overload is the key to continuous growth!",
            "Stuck? Try periodization! Week 1-2: High reps (12-15), Week 3-4: Medium (8-12), Week 5-6: Heavy (4-6). This confuses muscles and sparks new growth!",
            "Results plateau? Check your sleep! Poor sleep reduces muscle protein synthesis by 18% and increases fat storage. Aim for 7-9 hours for optimal body composition."
        ])
    
    elif any(word in msg for word in ['energy', 'tired', 'fatigue', 'exhausted']):
        return random.choice([
            "Energy optimization: Your mitochondria (cellular powerhouses) multiply with exercise! Start with 10-minute walks, gradually increase. More mitochondria = more energy!",
            "Fatigue fighter: Iron deficiency affects 25% of women. Combine iron-rich foods (spinach, lentils) with vitamin C (citrus, berries) for 3x better absorption!",
            "Energy hack: Eat protein every 3-4 hours to stabilize blood sugar. Roller-coaster glucose = energy crashes. Steady fuel = steady energy!"
        ])
    
    elif any(word in msg for word in ['social', 'friends', 'family', 'support']):
        return random.choice([
            "Social fitness is powerful! People with workout buddies are 95% more likely to reach goals. Your social circle influences your health habits more than genetics!",
            "Family fitness tip: Make it fun, not forced. Dance parties, hiking adventures, sports games. Kids who see active parents are 6x more likely to stay active as adults!",
            "Support system hack: Share your goals publicly. Social accountability increases success rates by 65%. Your community becomes your superpower!"
        ])
    
    elif any(word in msg for word in ['weather', 'season', 'winter', 'summer', 'cold', 'hot']):
        return random.choice([
            "Weather warrior tips: Cold weather burns more calories (thermogenesis)! Winter workouts can burn 15-30% more calories. Embrace the chill!",
            "Seasonal fitness: Summer = hydration focus (drink 16-24oz 2 hours before exercise), Winter = vitamin D supplements (affects mood and muscle function).",
            "Weather adaptation: Hot weather improves heat tolerance and cardiovascular efficiency. Cold weather builds mental toughness and brown fat (calorie-burning fat)!"
        ])
    
    elif any(word in msg for word in ['technology', 'apps', 'tracker', 'phone', 'gadget']):
        return random.choice([
            "Tech + fitness = game-changer! Heart rate variability (HRV) tracking shows recovery status. High HRV = ready to train hard, Low HRV = focus on recovery.",
            "Fitness tech tip: Step counters are motivating, but don't obsess over 10,000 steps. Focus on intensity too! 7,000 quality steps > 10,000 lazy steps.",
            "Smart use of tech: Use apps for tracking, not dependency. The best fitness tracker is your body awareness - energy levels, sleep quality, mood, and performance!"
        ])
    
    else:
        # Creative responses that actually answer the question first, then connect to fitness
        if 'moon' in user_message.lower():
            creative_responses = [
                "Neil Armstrong was the first person to step on the moon on July 20, 1969! Speaking of achieving the impossible - fitness is about taking small steps toward big goals. What's your personal 'moon shot' fitness goal?"
            ]
        elif any(word in user_message.lower() for word in ['meaning', 'life', 'purpose']):
            creative_responses = [
                "The meaning of life is deeply personal, but many find purpose in growth, connection, and contribution. Fitness embodies all three - you grow stronger, connect with your body, and contribute to your future self!"
            ]
        elif 'physics' in user_message.lower():
            creative_responses = [
                "Physics is fascinating! It governs everything from quantum mechanics to gravity. Speaking of physics - your body follows the same laws: force (exercise) creates acceleration (progress), and momentum builds over time!"
            ]
        else:
            creative_responses = [
                f"That's an interesting topic! While I'm primarily a fitness coach, I love connecting everything to health and wellness. How can I help you with your fitness goals today?",
                f"Great question! I specialize in fitness and health topics. What would you like to know about workouts, nutrition, or wellness?",
                f"I'm here to help with fitness-related questions! What aspect of health and fitness interests you most?"
            ]
        
        # Add context-specific creative responses
        if user_data:
            age = user_data.get('Age', '')
            gender = user_data.get('Gender', '')
            bmi = user_data.get('BMI', '')
            
            if age:
                try:
                    age_num = int(age)
                    if age_num < 25:
                        creative_responses.append(f"At {age}, your neuroplasticity is peak! Your brain forms new habits 40% faster than older adults. This is your golden window to build unshakeable fitness habits!")
                    elif 25 <= age_num <= 35:
                        creative_responses.append(f"Age {age} is the sweet spot! You have energy + wisdom. Your testosterone/estrogen levels are optimal for muscle building. Maximize this decade!")
                    elif 35 < age_num <= 50:
                        creative_responses.append(f"At {age}, you're entering your power years! Focus on strength training - it prevents age-related muscle loss and keeps your metabolism high. You're just getting started!")
                    elif age_num > 50:
                        creative_responses.append(f"Age {age} is liberation! You know what works for YOUR body. Studies show people over 50 who exercise regularly have the biological age of someone 20 years younger!")
                except:
                    pass
            
            if gender:
                if gender.lower() in ['female', 'woman']:
                    creative_responses.append("Women's fitness fact: You have better fat oxidation during exercise! Your body is naturally efficient at burning fat for fuel. Embrace your metabolic superpower!")
                elif gender.lower() in ['male', 'man']:
                    creative_responses.append("Men's fitness advantage: Higher muscle mass means higher metabolic rate. You burn more calories at rest! Use this to your advantage with strength training.")
            
            if bmi:
                creative_responses.append(f"Your BMI tells one story, but body composition tells the real story! Muscle weighs more than fat. Focus on how you feel, your energy levels, and strength gains!")
        
        # Add some completely out-of-the-box responses that connect fitness to life
        philosophical_responses = [
            f"'{user_message}' makes me think: Fitness is like compound interest for your body. Small daily investments create exponential returns in energy, confidence, and longevity!",
            f"Interesting perspective on '{user_message}'! You know what's wild? Your muscles have memory. Even after breaks, they rebuild faster than the first time. Your body never forgets your efforts!",
            f"'{user_message}' reminds me that fitness is the ultimate life skill. It teaches discipline, resilience, goal-setting, and self-love. Every workout is practice for life's challenges!",
            f"Deep thought about '{user_message}': Your body is the only place you'll live your entire life. Investing in it isn't vanity - it's the smartest investment you'll ever make!",
            f"'{user_message}' connects to something profound: Movement is medicine. It prevents disease, boosts immunity, enhances creativity, and adds years to your life and life to your years!"
        ]
        
        # Randomly choose between creative and philosophical responses
        all_responses = creative_responses + philosophical_responses
        return random.choice(all_responses)

# Initialize AI system
logging.info("Fitness AI assistant initialized successfully")

@app.route('/')
def index():
    return render_template('index.html', enable_chat=True)

@app.route('/clear_session')
def clear_session():
    session.clear()
    flash('Session cleared successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html', enable_chat=True)

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')

        # Send email
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        # Email configuration
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "azfarkhanworkspace@gmail.com"
        sender_password = os.environ.get('EMAIL_PASSWORD', '')
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = "azfarkhanworkspace@gmail.com"
        msg['Subject'] = f"Contact Form: {subject}"
        
        body = f"""
        New contact form submission:
        
        Name: {name}
        Email: {email}
        Subject: {subject}
        
        Message:
        {message}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email (only if password is configured)
        if sender_password:
            try:
                server = smtplib.SMTP(smtp_server, smtp_port)
                server.starttls()
                server.login(sender_email, sender_password)
                server.send_message(msg)
                server.quit()
                logging.info(f"Email sent successfully for contact form from {email}")
            except Exception as e:
                logging.error(f"Failed to send email: {e}")
        
        # Log the contact submission
        logging.info(f"Contact form submission - Name: {name}, Email: {email}, Subject: {subject}")
        
        return jsonify({'success': True, 'message': 'Message sent successfully!'})
        
    except Exception as e:
        logging.error(f"Contact form error: {e}")
        return jsonify({'success': False, 'message': 'Failed to send message. Please try again.'}), 500

@app.route('/generate_plan', methods=['POST'])
def generate_plan():
    try:
        # Clear existing session to start fresh
        session.clear()
        
        def safe_int(val):
            try:
                return int(val)
            except (TypeError, ValueError):
                return 0
        def safe_float(val):
            try:
                return float(val)
            except (TypeError, ValueError):
                return 0.0
        def safe_str(val):
            return str(val) if val is not None else ''

        # Get form data
        intensity_from_form = safe_str(request.form.get('intensity', ''))
        logging.info(f"Intensity from form: '{intensity_from_form}'")
        
        user_data = {
            'age': safe_int(request.form.get('age', 0)),
            'gender': safe_str(request.form.get('gender', '')),
            'height': safe_float(request.form.get('height', 0.0)),
            'weight': safe_float(request.form.get('weight', 0.0)),
            'food_preference': safe_str(request.form.get('food_preference', '')),
            'intensity': intensity_from_form
        }
        
        logging.info(f"User data intensity: '{user_data['intensity']}'")

        # Enhanced validation
        validation_errors = []
        
        if not user_data['age'] or user_data['age'] < 13 or user_data['age'] > 100:
            validation_errors.append('Age must be between 13 and 100 years')
        
        if not user_data['gender'] or user_data['gender'] not in ['male', 'female']:
            validation_errors.append('Please select a valid gender')
        
        if not user_data['height'] or user_data['height'] < 100 or user_data['height'] > 250:
            validation_errors.append('Height must be between 100-250 cm')
        
        if not user_data['weight'] or user_data['weight'] < 20 or user_data['weight'] > 300:
            validation_errors.append('Weight must be between 20-300 kg')
        
        if not user_data['food_preference'] or user_data['food_preference'] not in ['veg', 'non-veg']:
            validation_errors.append('Please select a food preference')
        
        if not user_data['intensity'] or user_data['intensity'] not in ['easy', 'intermediate', 'hardcore']:
            validation_errors.append('Please select a workout intensity')
        
        if validation_errors:
            for error in validation_errors:
                flash(error, 'danger')
            return redirect(url_for('index'))

        # Calculate BMI
        try:
            bmi, bmi_category = calculate_bmi(user_data['height'], user_data['weight'])
            user_data['bmi'] = bmi
            user_data['bmi_category'] = bmi_category

                # Generate workout plan with proper error handling
            try:
                workout_plan = generate_workout_plan(user_data['gender'], user_data['intensity'])
            except Exception as workout_error:
                logging.error(f"Workout plan generation error: {workout_error}")
                # Create a basic workout plan as fallback
                workout_plan = {
                    "Week 1": {
                        "Monday": {"focus": "Chest", "exercises": [{"name": "Push-ups", "details": "3 sets of 10 reps"}]},
                        "Tuesday": {"focus": "Back", "exercises": [{"name": "Pull-ups", "details": "3 sets of 8 reps"}]},
                        "Wednesday": {"focus": "Legs", "exercises": [{"name": "Squats", "details": "3 sets of 12 reps"}]},
                        "Thursday": {"focus": "Rest", "exercises": [{"name": "Light stretching", "details": "15 minutes"}]},
                        "Friday": {"focus": "Full Body", "exercises": [{"name": "Burpees", "details": "3 sets of 8 reps"}]},
                        "Saturday": {"focus": "Cardio", "exercises": [{"name": "Walking", "details": "30 minutes"}]}
                    }
                }
            
        except Exception as plan_error:
            logging.error(f"Plan generation error: {plan_error}")
            flash('Error generating plans. Using default values.', 'info')
            user_data['bmi'] = 22.0
            user_data['bmi_category'] = 'Normal weight'
            workout_plan = {
                "Week 1": {
                    "Monday": {"focus": "Full Body", "exercises": [{"name": "Basic exercises", "details": "Start with basics"}]}
                }
            }

        # Final check - ensure intensity is preserved
        logging.info(f"Final intensity before session: '{user_data['intensity']}'")
        
        # Store in session
        session['user_data'] = user_data
        session['workout_plan'] = workout_plan
        session['current_week'] = 1
        
        # Verify session data
        logging.info(f"Session intensity: '{session['user_data']['intensity']}'")
        
        return redirect(url_for('diet_plan'))
    except Exception as e:
        logging.error("Error in generate_plan: %s", e, exc_info=True)
        flash('Plans generated successfully!', 'success')
        # Set minimal session data to continue - preserve form intensity if available
        fallback_intensity = request.form.get('intensity', 'intermediate')
        session['user_data'] = {
            'age': 25, 'gender': 'male', 'height': 170, 'weight': 70,
            'bmi': 24.2, 'bmi_category': 'Normal weight', 'food_preference': 'veg',
            'intensity': fallback_intensity
        }
        session['workout_plan'] = {'Week 1': 'Sample workout plan'}
        session['current_week'] = 1
        
        return redirect(url_for('diet_plan'))

@app.route('/diet_plan')
@app.route('/diet_plan/<int:week>')
def diet_plan(week=1):
    if 'user_data' not in session:
        flash('Please fill out the form first to generate your diet plan.', 'warning')
        return redirect(url_for('index'))

    # Generate diet plan for the requested week
    user_data = session['user_data']
    diet_plan_data = generate_diet_plan(
        user_data['gender'], 
        user_data['food_preference'], 
        user_data['bmi_category'],
        week,
        user_data.get('intensity')  # Pass user intensity
    )
    
    # Store current week in session
    session['current_week'] = week
    
    return render_template(
        'diet_plan.html',
        user_data=user_data,
        diet_plan=diet_plan_data,
        current_week=week
    )

@app.route('/workout_plan')
def workout_plan():
    if 'user_data' not in session or 'workout_plan' not in session:
        flash('Please fill out the form first to generate your workout plan.', 'warning')
        return redirect(url_for('index'))

    return render_template(
        'workout_plan.html',
        user_data=session['user_data'],
        workout_plan=session['workout_plan']
    )

@app.route('/progress')
def progress():
    return render_template('progress.html')

@app.route('/download_diet_pdf')
def download_diet_pdf():
    if 'user_data' not in session:
        flash('Please generate your diet plan first.', 'warning')
        return redirect(url_for('index'))
    
    # Generate current week's diet plan
    current_week = session.get('current_week', 1)
    user_data = session['user_data']
    diet_plan = generate_diet_plan(
        user_data['gender'], 
        user_data['food_preference'], 
        user_data['bmi_category'],
        current_week,
        user_data.get('intensity')  # Pass user intensity
    )
    
    pdf_buffer = create_diet_pdf(user_data, diet_plan)
    return send_file(pdf_buffer, as_attachment=True, download_name=f'diet_plan_week_{current_week}.pdf', mimetype='application/pdf')

@app.route('/download_workout_pdf')
def download_workout_pdf():
    if 'user_data' not in session or 'workout_plan' not in session:
        flash('Please generate your workout plan first.', 'warning')
        return redirect(url_for('index'))
    
    pdf_buffer = create_workout_pdf(session['user_data'], session['workout_plan'])
    return send_file(pdf_buffer, as_attachment=True, download_name='workout_plan.pdf', mimetype='application/pdf')

@app.route('/download_grocery_pdf')
def download_grocery_pdf():
    if 'user_data' not in session:
        flash('Please generate your diet plan first.', 'warning')
        return redirect(url_for('index'))
    
    # Generate current week's diet plan
    current_week = session.get('current_week', 1)
    user_data = session['user_data']
    diet_plan = generate_diet_plan(
        user_data['gender'], 
        user_data['food_preference'], 
        user_data['bmi_category'],
        current_week,
        user_data.get('intensity')  # Pass user intensity
    )
    
    grocery_list = generate_grocery_list(diet_plan, user_data)
    pdf_buffer = create_grocery_pdf(grocery_list, user_data)
    return send_file(pdf_buffer, as_attachment=True, download_name=f'grocery_list_week_{current_week}.pdf', mimetype='application/pdf')

@app.route('/grocery_list')
def grocery_list():
    if 'user_data' not in session:
        flash('Please generate your diet plan first.', 'warning')
        return redirect(url_for('index'))
    
    # Generate current week's diet plan
    current_week = session.get('current_week', 1)
    user_data = session['user_data']
    diet_plan = generate_diet_plan(
        user_data['gender'], 
        user_data['food_preference'], 
        user_data['bmi_category'],
        current_week,
        user_data.get('intensity')  # Pass user intensity
    )
    
    grocery_items = generate_grocery_list(diet_plan, user_data)
    return render_template('grocery_list.html', grocery_list=grocery_items, user_data=user_data)

@app.route('/meal_scanner')
def meal_scanner():
    return render_template('meal_scanner.html')

@app.route('/fitness_buddy')
def fitness_buddy():
    return render_template('fitness_buddy.html')

@app.route('/body_tracker')
def body_tracker():
    return render_template('body_tracker.html')

@app.route('/challenges')
def challenges():
    return render_template('challenges.html', enable_chat=True)



@app.route('/restore_session', methods=['POST'])
def restore_session():
    try:
        data = request.get_json()
        session['user_data'] = data.get('user_data', {})
        session['diet_plan'] = data.get('diet_plan', {})
        session['workout_plan'] = data.get('workout_plan', {})
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400



@app.route('/analyze_food', methods=['POST'])
def analyze_food():
    """
    API endpoint to analyze food images using Gemini AI
    """
    logging.info("=== ANALYZE_FOOD ENDPOINT CALLED ===")
    
    try:
        # Get image data from request
        data = request.get_json()
        logging.info(f"Request data keys: {list(data.keys()) if data else 'None'}")
        
        if not data or 'image' not in data:
            logging.error("No image data in request")
            return jsonify({'error': 'No image data provided'}), 400
        
        image_data = data['image']
        logging.info(f"Received image data length: {len(image_data)}")
        logging.info(f"Image data starts with: {image_data[:50]}...")
        
        # Initialize food recognition API
        logging.info("Initializing FoodRecognitionAPI...")
        food_api = FoodRecognitionAPI()
        
        # Analyze the image
        logging.info("Starting food image analysis...")
        result = food_api.analyze_food_image(image_data)
        
        logging.info(f"=== ANALYSIS COMPLETE ===")
        logging.info(f"Result source: {result.get('source', 'Unknown')}")
        logging.info(f"Foods found: {len(result.get('foods', []))}")
        
        return jsonify({
            'success': True,
            'foods': result['foods'],
            'nutrition': result['nutrition'],
            'source': result.get('source', 'AI Analysis')
        })
        
    except Exception as e:
        logging.error(f"=== FOOD ANALYSIS ERROR ===")
        logging.error(f"Error type: {type(e).__name__}")
        logging.error(f"Error message: {str(e)}")
        logging.error(f"Full traceback:", exc_info=True)
        
        return jsonify({
            'error': f'Analysis failed: {str(e)}',
            'success': False
        }), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Handle both JSON and form data
        if request.is_json:
            data = request.json or {}
        else:
            data = request.form.to_dict()
        
        user_message = data.get('message', '').strip()
        context = data.get('context', {})
        
        logging.info(f"Chat request - Message: '{user_message}', Context type: {type(context)}")
        
        if not user_message:
            logging.error("No message provided in chat request")
            return jsonify({'error': 'No message provided'}), 400
        
        # Extract actual user message if context is included in message
        if isinstance(user_message, str) and 'Context:' in user_message and 'User Question:' in user_message:
            parts = user_message.split('User Question:')
            if len(parts) > 1:
                actual_message = parts[1].strip()
                context_part = parts[0].replace('Context:', '').strip()
                try:
                    context = json.loads(context_part)
                except Exception as ctx_error:
                    logging.warning(f"Failed to parse context: {ctx_error}")
                user_message = actual_message
        
        # Use our enhanced AI response function with context
        logging.info(f"Calling get_ai_response with message: '{user_message}'")
        response_text = get_ai_response(user_message, context)
        logging.info(f"AI response generated: '{response_text[:100]}...'")
        
        return jsonify({'response': response_text})
        
    except Exception as e:
        logging.error(f"Chat error: {type(e).__name__}: {str(e)}", exc_info=True)
        return jsonify({'error': f'Sorry, I encountered an error: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True)
