// Session Persistence using localStorage
class SessionPersistence {
    constructor() {
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupStorageSync();
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(`fitness_${key}`, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    }

    loadFromStorage() {
        try {
            const userData = localStorage.getItem('fitness_user_data');
            const dietPlan = localStorage.getItem('fitness_diet_plan');
            const workoutPlan = localStorage.getItem('fitness_workout_plan');

            if (userData && dietPlan && workoutPlan) {
                // Data exists in localStorage, restore session
                this.restoreSession(
                    JSON.parse(userData),
                    JSON.parse(dietPlan),
                    JSON.parse(workoutPlan)
                );
            }
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
        }
    }

    restoreSession(userData, dietPlan, workoutPlan) {
        // Send data to server to restore session
        fetch('/restore_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_data: userData,
                diet_plan: dietPlan,
                workout_plan: workoutPlan
            })
        }).catch(e => console.warn('Failed to restore session:', e));
    }

    setupStorageSync() {
        // Save session data when page loads
        if (window.sessionData) {
            this.saveToStorage('user_data', window.sessionData.user_data);
            this.saveToStorage('diet_plan', window.sessionData.diet_plan);
            this.saveToStorage('workout_plan', window.sessionData.workout_plan);
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new SessionPersistence();
});