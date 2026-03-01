# FitnessNavigator 🏋️‍♂️

A comprehensive AI-powered fitness and nutrition web application built with Flask and Google Gemini AI.

## Features ✨

### 🍽️ Personalized Diet Plans
- Custom weekly meal plans based on gender, food preferences, and BMI
- Vegetarian and non-vegetarian options
- Downloadable PDF diet plans and grocery lists

### 🏃‍♂️ Tailored Workout Routines
- Gender-specific workout plans with 3 intensity levels (Easy, Medium, Hard)
- Monthly workout schedules
- Downloadable PDF workout plans

### 📸 AI Meal Scanner
- Real-time food recognition using Google Gemini AI
- Nutritional analysis with calorie, protein, carbs, and fat breakdown
- Camera capture and file upload support
- Daily food logging and progress tracking

### 🤖 AI Fitness Chatbot
- Intelligent fitness assistant powered by Gemini AI
- Answers questions about workouts, nutrition, motivation, and health
- Contextual responses based on user queries

### 📊 Health Tools
- BMI calculator with health recommendations
- Progress tracking and body metrics
- Fitness challenges and goal setting

## Tech Stack 🛠️

### Backend
- **Python 3.x** - Core programming language
- **Flask 3.1.0** - Web framework
- **Google Gemini AI** - AI chatbot and food recognition
- **ReportLab** - PDF generation
- **Pillow (PIL)** - Image processing
- **python-dotenv** - Environment variable management

### Frontend
- **HTML5/CSS3** - Structure and styling
- **JavaScript (ES6+)** - Interactive functionality
- **Bootstrap** - Responsive UI framework
- **Font Awesome** - Icons

### APIs & Services
- **Google Gemini API** - AI-powered responses and image analysis
- **Google Vision API** - Food recognition (alternative)

## Installation 🚀

### Prerequisites
- Python 3.7+
- Google Gemini API key

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/FitnessNavigator.git
cd FitnessNavigator
```

2. **Install dependencies**
```bash
pip install -r requirements_clean.txt
```

3. **Set up environment variables**
Create a `.env` file in the project root:
```env
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
FOOD_API_PROVIDER=GOOGLE
GOOGLE_VISION_API_KEY=your-gemini-api-key-here
```

4. **Get Google Gemini API Key**
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Add it to your `.env` file

5. **Run the application**
```bash
python app.py
```

6. **Open in browser**
Navigate to `http://127.0.0.1:5002`

## Usage 📱

### Generate Fitness Plans
1. Fill out the user form with your details (age, gender, height, weight, preferences)
2. Click "Generate Plan" to create personalized diet and workout plans
3. View your plans and download PDFs

### AI Meal Scanner
1. Go to the Meal Scanner page
2. Upload a food image or use your camera
3. Get instant AI-powered food recognition and nutrition analysis
4. Save meals to your daily food log

### Fitness Chatbot
1. Use the chat widget available on all pages
2. Ask questions about fitness, nutrition, workouts, or health
3. Get intelligent, contextual responses from the AI assistant

## Project Structure 📁

```
FitnessNavigator/
├── app.py                 # Main Flask application
├── routes.py             # URL routes and API endpoints
├── utils.py              # Utility functions for plan generation
├── food_recognition.py   # AI food recognition system
├── pdf_generator.py      # PDF creation utilities
├── requirements_clean.txt # Python dependencies
├── .env                  # Environment variables (create this)
├── templates/            # HTML templates
│   ├── layout.html
│   ├── index.html
│   ├── meal_scanner.html
│   └── ...
└── static/              # CSS, JS, and image files
    ├── css/
    ├── js/
    └── images/
```

## API Endpoints 🔌

- `POST /analyze_food` - Analyze food images with AI
- `POST /chat` - AI chatbot responses
- `POST /generate_plan` - Generate fitness plans
- `GET /diet_plan` - View diet plan
- `GET /workout_plan` - View workout plan
- `GET /download_*_pdf` - Download PDF reports

## Features in Detail 🔍

### AI Food Recognition
- Uses Google Gemini AI for accurate food identification
- Supports real-time camera capture and file uploads
- Provides detailed nutritional analysis
- Tracks daily food intake and calories

### Personalized Plans
- BMI-based diet recommendations
- Gender-specific workout routines
- Customizable intensity levels
- Weekly meal planning with grocery lists

### Smart Chatbot
- Contextual fitness advice
- Nutrition guidance
- Workout recommendations
- Motivation and tips

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Google Gemini AI for powerful AI capabilities
- Flask community for the excellent web framework
- Bootstrap for responsive UI components
- Font Awesome for beautiful icons

## Support 💬

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/FitnessNavigator/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your setup and the issue

---

**Made with ❤️ for fitness enthusiasts and health-conscious individuals**