// AI Voice Coach - Game Changer Feature
class VoiceCoach {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.currentWorkout = null;
        this.repCount = 0;
        this.setCount = 0;
        this.init();
    }

    init() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => this.handleVoiceCommand(event);
            this.recognition.onerror = (event) => console.log('Voice recognition error:', event.error);
        }
        
        this.createVoiceUI();
        this.bindEvents();
    }

    createVoiceUI() {
        const startButton = document.createElement('button');
        startButton.id = 'voice-start-btn';
        startButton.className = 'fab voice-fab';
        startButton.innerHTML = '🎤 Start';
        startButton.title = 'Start Voice Coach';
        document.body.appendChild(startButton);

        const stopButton = document.createElement('button');
        stopButton.id = 'voice-stop-btn';
        stopButton.className = 'fab voice-fab stop-btn';
        stopButton.innerHTML = '⏹️ Stop';
        stopButton.title = 'Stop Voice Coach';
        stopButton.style.display = 'none';
        document.body.appendChild(stopButton);

        const indicator = document.createElement('div');
        indicator.id = 'voice-indicator';
        indicator.className = 'voice-indicator';
        indicator.innerHTML = '🔊';
        document.body.appendChild(indicator);
    }

    bindEvents() {
        document.getElementById('voice-start-btn').addEventListener('click', () => {
            this.startListening();
        });

        document.getElementById('voice-stop-btn').addEventListener('click', () => {
            this.stopListening();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && e.ctrlKey) {
                e.preventDefault();
                this.toggleListening();
            }
        });
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.recognition) {
            this.speak("Voice recognition not supported on this browser");
            return;
        }

        this.isListening = true;
        try {
            this.recognition.start();
        } catch (e) {
            console.log('Recognition already started');
        }
        
        document.getElementById('voice-start-btn').style.display = 'none';
        document.getElementById('voice-stop-btn').style.display = 'block';
        document.getElementById('voice-indicator').classList.add('active');
        
        this.speak("Voice coach activated. Say 'start workout' to begin, or ask me anything!");
        this.showToast("🎤 Voice Coach Active - Say 'start workout' or ask questions", 'success');
    }

    stopListening() {
        this.isListening = false;
        
        if (this.recognition) {
            try {
                this.recognition.stop();
                this.recognition.abort();
            } catch (e) {
                console.log('Recognition already stopped');
            }
        }
        
        document.getElementById('voice-start-btn').style.display = 'block';
        document.getElementById('voice-stop-btn').style.display = 'none';
        document.getElementById('voice-indicator').classList.remove('active');
        
        this.speak("Voice coach deactivated");
        this.showToast("🔇 Voice Coach Disabled", 'info');
    }

    handleVoiceCommand(event) {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        
        console.log('Voice command:', command);

        // Workout commands
        if (command.includes('start workout') || command.includes('begin workout')) {
            this.startWorkout();
        }
        else if (command.includes('next exercise')) {
            this.nextExercise();
        }
        else if (command.includes('count reps') || command.includes('start counting')) {
            this.startRepCounting();
        }
        else if (command.includes('rest') || command.includes('break')) {
            this.startRest();
        }
        else if (command.includes('stop workout') || command.includes('end workout')) {
            this.endWorkout();
        }
        
        // Nutrition commands
        else if (command.includes('log meal') || command.includes('add food')) {
            this.logMeal();
        }
        else if (command.includes('water reminder') || command.includes('drink water')) {
            this.waterReminder();
        }
        
        // Information commands
        else if (command.includes('my progress') || command.includes('show stats')) {
            this.showProgress();
        }
        else if (command.includes('today calories') || command.includes('calorie count')) {
            this.showCalories();
        }
        
        // Motivation commands
        else if (command.includes('motivate me') || command.includes('motivation')) {
            this.motivate();
        }
        else if (command.includes('how am i doing') || command.includes('feedback')) {
            this.giveFeedback();
        }
        
        // Help command
        else if (command.includes('help') || command.includes('what can you do')) {
            this.showHelp();
        }
        
        // Default response
        else if (command.length > 3) {
            this.handleGeneralQuery(command);
        }
    }

    startWorkout() {
        this.currentWorkout = {
            name: "Full Body Workout",
            exercises: [
                { name: "Push-ups", reps: 15, sets: 3 },
                { name: "Squats", reps: 20, sets: 3 },
                { name: "Planks", duration: 30, sets: 3 },
                { name: "Lunges", reps: 12, sets: 3 }
            ],
            currentExercise: 0
        };
        
        this.repCount = 0;
        this.setCount = 1;
        
        const exercise = this.currentWorkout.exercises[0];
        this.speak(`Starting your workout! First exercise: ${exercise.name}. ${exercise.reps ? `Do ${exercise.reps} reps` : `Hold for ${exercise.duration} seconds`}. Set ${this.setCount} of ${exercise.sets}. Say 'count reps' when ready!`);
        
        this.showWorkoutUI();
    }

    startRepCounting() {
        if (!this.currentWorkout) {
            this.speak("Please start a workout first by saying 'start workout'");
            return;
        }

        const exercise = this.currentWorkout.exercises[this.currentWorkout.currentExercise];
        this.speak(`Starting rep count for ${exercise.name}. I'll count with you!`);
        
        // Simulate rep counting (in real app, this would use computer vision)
        this.simulateRepCounting(exercise);
    }

    simulateRepCounting(exercise) {
        let currentRep = 1;
        const targetReps = exercise.reps || 10;
        
        const countInterval = setInterval(() => {
            if (currentRep <= targetReps) {
                this.speak(currentRep.toString());
                this.updateWorkoutUI(currentRep, targetReps);
                currentRep++;
            } else {
                clearInterval(countInterval);
                this.completeSet(exercise);
            }
        }, 2000); // 2 seconds per rep
    }

    completeSet(exercise) {
        this.setCount++;
        
        if (this.setCount <= exercise.sets) {
            this.speak(`Great job! Set ${this.setCount - 1} complete. Rest for 30 seconds, then we'll do set ${this.setCount}.`);
            setTimeout(() => {
                this.speak(`Ready for set ${this.setCount}? Say 'count reps' to continue!`);
            }, 30000);
        } else {
            this.speak(`Excellent! ${exercise.name} complete! Say 'next exercise' to continue.`);
            this.setCount = 1;
        }
    }

    nextExercise() {
        if (!this.currentWorkout) return;
        
        this.currentWorkout.currentExercise++;
        
        if (this.currentWorkout.currentExercise >= this.currentWorkout.exercises.length) {
            this.endWorkout();
            return;
        }
        
        const exercise = this.currentWorkout.exercises[this.currentWorkout.currentExercise];
        this.speak(`Next exercise: ${exercise.name}. ${exercise.reps ? `Do ${exercise.reps} reps` : `Hold for ${exercise.duration} seconds`}. Set 1 of ${exercise.sets}. Say 'count reps' when ready!`);
    }

    endWorkout() {
        if (this.currentWorkout) {
            this.speak("Workout complete! Amazing job! You burned approximately 250 calories. Don't forget to stretch and hydrate!");
            this.currentWorkout = null;
            this.hideWorkoutUI();
            this.showToast("🎉 Workout Complete! Great job!", 'success');
        }
    }

    logMeal() {
        this.speak("Opening meal scanner. Take a photo of your meal and I'll analyze the nutrition for you!");
        // Redirect to meal scanner
        if (window.location.pathname !== '/meal_scanner') {
            window.location.href = '/meal_scanner';
        }
    }

    waterReminder() {
        this.speak("Time to hydrate! Drink a glass of water. I'll remind you again in an hour.");
        this.showToast("💧 Hydration Reminder - Drink water!", 'info');
        
        // Set reminder for 1 hour
        setTimeout(() => {
            this.speak("Hydration reminder! Time for another glass of water.");
            this.showToast("💧 Drink Water Reminder", 'info');
        }, 3600000); // 1 hour
    }

    showProgress() {
        // Simulate progress data
        const progress = {
            workoutsThisWeek: 4,
            caloriesBurned: 1250,
            weightLoss: 2.3
        };
        
        this.speak(`Here's your progress: You've completed ${progress.workoutsThisWeek} workouts this week, burned ${progress.caloriesBurned} calories, and lost ${progress.weightLoss} pounds. Keep up the great work!`);
    }

    showCalories() {
        // Simulate calorie data
        const calories = {
            consumed: 1650,
            burned: 320,
            remaining: 1030
        };
        
        this.speak(`Today you've consumed ${calories.consumed} calories, burned ${calories.burned} through exercise, and have ${calories.remaining} calories remaining for your goal.`);
    }

    motivate() {
        const motivations = [
            "You're stronger than you think! Every rep counts!",
            "Champions are made in the gym! Keep pushing!",
            "Your only competition is who you were yesterday!",
            "Pain is temporary, but quitting lasts forever!",
            "You've got this! I believe in you!",
            "Success starts with self-discipline!",
            "Make yourself proud! You're doing amazing!"
        ];
        
        const motivation = motivations[Math.floor(Math.random() * motivations.length)];
        this.speak(motivation);
        this.showToast("💪 " + motivation, 'success');
    }

    giveFeedback() {
        this.speak("You're doing fantastic! Your consistency is improving, and I can see you're getting stronger. Keep focusing on proper form and listen to your body. You're on the right track!");
    }

    showHelp() {
        this.speak("I'm your AI fitness coach! I can help you with workouts, count reps, log meals, track progress, and provide motivation. Try saying: 'start workout', 'log meal', 'my progress', or 'motivate me'. What would you like to do?");
    }

    handleGeneralQuery(query) {
        // Simple AI responses for fitness queries
        if (query.includes('protein') || query.includes('muscle')) {
            this.speak("For muscle building, aim for 1.6 to 2.2 grams of protein per kilogram of body weight daily. Good sources include chicken, fish, eggs, and legumes.");
        }
        else if (query.includes('cardio') || query.includes('running')) {
            this.speak("For cardio, aim for 150 minutes of moderate activity or 75 minutes of vigorous activity per week. Start slow and gradually increase intensity.");
        }
        else if (query.includes('weight loss') || query.includes('lose weight')) {
            this.speak("Weight loss requires a calorie deficit. Combine regular exercise with a balanced diet. Aim to lose 1-2 pounds per week for sustainable results.");
        }
        else {
            this.speak("That's a great question! For detailed fitness advice, you can also chat with me using the chat button. I'm here to help with all your fitness goals!");
        }
    }

    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            this.synthesis.speak(utterance);
        }
    }

    showWorkoutUI() {
        let workoutUI = document.getElementById('workout-ui');
        if (!workoutUI) {
            workoutUI = document.createElement('div');
            workoutUI.id = 'workout-ui';
            workoutUI.className = 'glass-card workout-overlay';
            workoutUI.innerHTML = `
                <div class="workout-header">
                    <h3>🏋️ Active Workout</h3>
                    <button onclick="voiceCoach.endWorkout()" class="btn-close">×</button>
                </div>
                <div class="workout-content">
                    <div class="exercise-name">Push-ups</div>
                    <div class="rep-counter">
                        <span class="current-rep">0</span> / <span class="target-rep">15</span>
                    </div>
                    <div class="set-counter">Set 1 of 3</div>
                    <div class="workout-controls">
                        <button onclick="voiceCoach.startRepCounting()" class="btn-modern">Count Reps</button>
                        <button onclick="voiceCoach.nextExercise()" class="btn-modern">Next Exercise</button>
                    </div>
                </div>
            `;
            document.body.appendChild(workoutUI);
        }
        workoutUI.style.display = 'block';
    }

    updateWorkoutUI(currentRep, targetRep) {
        const currentRepEl = document.querySelector('.current-rep');
        if (currentRepEl) {
            currentRepEl.textContent = currentRep;
        }
    }

    hideWorkoutUI() {
        const workoutUI = document.getElementById('workout-ui');
        if (workoutUI) {
            workoutUI.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 4000);
    }
}

// Initialize Voice Coach
let voiceCoach;
document.addEventListener('DOMContentLoaded', () => {
    voiceCoach = new VoiceCoach();
});

// Add CSS for workout UI
const workoutCSS = `
.workout-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    min-width: 300px;
    padding: 2rem;
    display: none;
}

.workout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.workout-header h3 {
    margin: 0;
    color: var(--text);
}

.btn-close {
    background: none;
    border: none;
    color: var(--text);
    font-size: 1.5rem;
    cursor: pointer;
}

.exercise-name {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
    color: var(--accent);
}

.rep-counter {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.current-rep {
    color: var(--accent);
}

.set-counter {
    text-align: center;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
}

.workout-controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.workout-controls .btn-modern {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
}

.voice-fab {
    background: var(--secondary) !important;
    margin-bottom: 10px;
}

.voice-fab.stop-btn {
    background: #dc3545 !important;
}

.toast {
    position: fixed;
    top: 6rem;
    right: 1rem;
    background: var(--glass);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 15px;
    padding: 1rem 1.5rem;
    color: var(--text);
    transform: translateX(400px);
    transition: all 0.3s ease;
    z-index: 1000;
    max-width: 280px;
    word-wrap: break-word;
}

.toast.show {
    transform: translateX(0);
}

.toast.success {
    border-left: 4px solid #00f2fe;
}

.toast.info {
    border-left: 4px solid #667eea;
}
`;

const style = document.createElement('style');
style.textContent = workoutCSS;
document.head.appendChild(style);