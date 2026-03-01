// Dashboard Integration - Combines all features
class DashboardIntegration {
    constructor() {
        this.init();
    }

    init() {
        this.createDashboardContent();
        this.loadAllFeatures();
    }

    createDashboardContent() {
        const dashboardHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <h2 class="dashboard-title">🚀 Your Fitness Command Center</h2>
                    <div class="dashboard-controls">
                        <a href="/meal_scanner" class="btn-modern">📸 Scan Meal</a>
                    </div>
                </div>

            <!-- Quick Stats -->
            <div class="stats-grid">
                <div class="stat-card glass-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-value">2,847</div>
                    <div class="stat-label">Calories Burned</div>
                    <div class="stat-change positive">+12% from last week</div>
                </div>
                <div class="stat-card glass-card">
                    <div class="stat-icon">💪</div>
                    <div class="stat-value">12</div>
                    <div class="stat-label">Workouts Done</div>
                    <div class="stat-change positive">+3 this week</div>
                </div>
                <div class="stat-card glass-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-value">75%</div>
                    <div class="stat-label">Goal Progress</div>
                    <div class="stat-change positive">On track</div>
                </div>
                <div class="stat-card glass-card">
                    <div class="stat-icon">⌚</div>
                    <div class="stat-value">85</div>
                    <div class="stat-label">Avg Heart Rate</div>
                    <div class="stat-change">Resting zone</div>
                </div>
            </div>

            <!-- AI Recommendations -->
            <div class="recommendations-section">
                <h3>🤖 AI Recommendations</h3>
                <div class="recommendations-grid">
                    <div class="recommendation-card glass-card">
                        <div class="rec-icon">🏃♂️</div>
                        <h5>Optimal Workout Time</h5>
                        <p>Your energy peaks at 6 PM. Schedule intense workouts then for 23% better performance.</p>
                        <button class="btn-modern btn-sm" onclick="scheduleWorkout()">Schedule Now</button>
                    </div>
                    <div class="recommendation-card glass-card">
                        <div class="rec-icon">🥗</div>
                        <h5>Nutrition Boost</h5>
                        <p>Add 15g more protein to reach your muscle-building goals. Try Greek yogurt or chicken.</p>
                        <button class="btn-modern btn-sm" onclick="viewNutritionFoods()">View Foods</button>
                    </div>
                    <div class="recommendation-card glass-card">
                        <div class="rec-icon">😴</div>
                        <h5>Recovery Alert</h5>
                        <p>Your sleep quality dropped 18%. Consider a rest day or light yoga session.</p>
                        <button class="btn-modern btn-sm" onclick="showRestPlan()">Rest Plan</button>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="actions-section">
                <h3>⚡ Quick Actions</h3>
                <div class="actions-grid">
                    <div class="action-card glass-card">
                        <div class="action-icon">🏋️♂️</div>
                        <h5>Start Workout</h5>
                        <p>AI-guided session with real-time form correction</p>
                        <a href="/workout_plan" class="btn-modern w-100">Begin</a>
                    </div>
                    <div class="action-card glass-card">
                        <div class="action-icon">📸</div>
                        <h5>Scan Meal</h5>
                        <p>Instant nutrition analysis with AI food recognition</p>
                        <a href="/meal_scanner" class="btn-modern w-100">Scan</a>
                    </div>
                    <div class="action-card glass-card">
                        <div class="action-icon">📊</div>
                        <h5>View Progress</h5>
                        <p>Detailed analytics and body transformation</p>
                        <a href="/progress" class="btn-modern w-100">Analyze</a>
                    </div>

                </div>
            </div>

            <!-- Today's Schedule -->
            <div class="schedule-section">
                <h3>📅 Today's Schedule</h3>
                <div class="schedule-card glass-card">
                    <div class="schedule-timeline">
                        <div class="schedule-item completed">
                            <div class="schedule-time">7:00 AM</div>
                            <div class="schedule-content">
                                <div class="schedule-title">Morning Cardio ✅</div>
                                <div class="schedule-desc">30 min run - 320 calories burned</div>
                            </div>
                        </div>
                        <div class="schedule-item active">
                            <div class="schedule-time">12:00 PM</div>
                            <div class="schedule-content">
                                <div class="schedule-title">Lunch Break 🍽️</div>
                                <div class="schedule-desc">Scan your meal for nutrition tracking</div>
                            </div>
                        </div>
                        <div class="schedule-item upcoming">
                            <div class="schedule-time">6:00 PM</div>
                            <div class="schedule-content">
                                <div class="schedule-title">Strength Training 💪</div>
                                <div class="schedule-desc">Upper body focus - 45 minutes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert into page
        const container = document.querySelector('.dashboard-page .container') || document.querySelector('.container') || document.body;
        container.innerHTML = dashboardHTML;
    }

    loadAllFeatures() {
        // Initialize all dashboard features
        setTimeout(() => {
            this.animateStats();
            this.loadRecentActivity();
        }, 500);
    }

    animateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }

    loadRecentActivity() {
        // Simulate loading recent activity
        console.log('Loading recent activity...');
    }
}

// Initialize Dashboard Integration
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/dashboard' || document.querySelector('.dashboard-page')) {
        new DashboardIntegration();
    }
});

// Global functions
function startAIWorkout() {
    window.location.href = '/workout_plan';
}

function enableVoiceCoach() {
    if (window.voiceCoach) {
        voiceCoach.startListening();
    }
    showToast('🎤 Voice Coach Enabled - Say "start workout" to begin!', 'success');
}

function disableVoiceCoach() {
    if (window.voiceCoach) {
        voiceCoach.stopListening();
    }
    showToast('🔇 Voice Coach Disabled', 'info');
}

function showToast(message, type = 'info') {
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

// AI Recommendation Functions
function scheduleWorkout() {
    showToast('🏃♂️ Workout scheduled for 6 PM - Optimal energy time!', 'success');
    // Add to calendar or schedule
    console.log('Scheduling workout for 6 PM');
}

function viewNutritionFoods() {
    showNutritionModal();
}

function showNutritionModal() {
    const modalHTML = `
        <div class="modal fade" id="nutritionModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content glass-card">
                    <div class="modal-header">
                        <h5 class="modal-title">🥗 High-Protein Foods & Supplements</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="nutrition-grid">
                            <div class="nutrition-card">
                                <div class="nutrition-icon">🥣</div>
                                <h6>Muesli</h6>
                                <p><strong>15g protein per 100g</strong></p>
                                <p>Rich in fiber, vitamins, and minerals. Perfect for breakfast energy boost and sustained muscle recovery.</p>
                                <span class="nutrition-tag">Breakfast</span>
                            </div>
                            <div class="nutrition-card">
                                <div class="nutrition-icon">🥤</div>
                                <h6>Whey Protein Isolate</h6>
                                <p><strong>90g protein per 100g</strong></p>
                                <p>Fast-absorbing protein for immediate post-workout muscle repair and growth. Low in carbs and fats.</p>
                                <span class="nutrition-tag">Post-Workout</span>
                            </div>
                            <div class="nutrition-card">
                                <div class="nutrition-icon">🥜</div>
                                <h6>Greek Yogurt</h6>
                                <p><strong>20g protein per cup</strong></p>
                                <p>Contains casein protein for slow release. Rich in probiotics for gut health and calcium for bones.</p>
                                <span class="nutrition-tag">Snack</span>
                            </div>
                            <div class="nutrition-card">
                                <div class="nutrition-icon">🍗</div>
                                <h6>Chicken Breast</h6>
                                <p><strong>31g protein per 100g</strong></p>
                                <p>Complete amino acid profile. Lean protein source for muscle building without excess calories.</p>
                                <span class="nutrition-tag">Main Meal</span>
                            </div>
                            <div class="nutrition-card">
                                <div class="nutrition-icon">🥚</div>
                                <h6>Eggs</h6>
                                <p><strong>13g protein per 2 eggs</strong></p>
                                <p>Perfect amino acid score. Contains leucine for muscle protein synthesis and choline for brain health.</p>
                                <span class="nutrition-tag">Anytime</span>
                            </div>
                            <div class="nutrition-card">
                                <div class="nutrition-icon">🌱</div>
                                <h6>Quinoa</h6>
                                <p><strong>14g protein per cup</strong></p>
                                <p>Complete plant protein with all 9 essential amino acids. High in fiber and complex carbs for energy.</p>
                                <span class="nutrition-tag">Vegetarian</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-modern" data-bs-dismiss="modal">Got it!</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('nutritionModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('nutritionModal'));
    modal.show();
}

function showRestPlan() {
    showToast('😴 Rest day plan activated - Light yoga recommended', 'info');
    // Show rest day activities
    console.log('Showing rest plan');
}

function openGoalSetter() {
    const modal = new bootstrap.Modal(document.getElementById('goalModal'));
    modal.show();
}

function saveGoals() {
    showToast('🎯 Goals saved successfully!', 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('goalModal'));
    modal.hide();
}

// Add CSS for Dashboard Integration
const dashboardCSS = `
.dashboard-page {
    padding: 2rem 0;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.dashboard-title {
    font-size: 2.5rem;
    font-weight: 800;
    background: var(--primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.dashboard-controls {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.voice-coach-toggle {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.toggle-label {
    font-weight: 600;
    color: var(--text);
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.2);
    transition: 0.4s;
    border-radius: 34px;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 3px;
    background: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked + .toggle-slider {
    background: var(--success);
}

input:checked + .toggle-slider:before {
    transform: translateX(26px);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.stat-card {
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: 800;
    background: var(--success);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
}

.stat-label {
    color: var(--text-muted);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
}

.stat-change {
    font-size: 0.8rem;
    font-weight: 600;
}

.stat-change.positive {
    color: #00f2fe;
}

.recommendations-section, .actions-section, .schedule-section {
    margin-bottom: 3rem;
}

.recommendations-section h3, .actions-section h3, .schedule-section h3 {
    margin-bottom: 1.5rem;
    color: var(--text);
    font-size: 1.5rem;
}

.recommendations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.recommendation-card {
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
}

.recommendation-card:hover {
    transform: translateY(-3px);
}

.rec-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.action-card {
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
}

.action-card:hover {
    transform: translateY(-5px);
}

.action-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.voice-coach-controls {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
}

.btn-success {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border: none;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.schedule-card {
    padding: 2rem;
}

.schedule-timeline {
    position: relative;
}

.schedule-item {
    display: flex;
    align-items: center;
    padding: 1rem 0;
    border-left: 3px solid rgba(255, 255, 255, 0.1);
    padding-left: 2rem;
    position: relative;
}

.schedule-item::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
}

.schedule-item.completed::before {
    background: #00f2fe;
}

.schedule-item.active::before {
    background: #f5576c;
    animation: pulse 2s infinite;
}

.schedule-time {
    font-weight: 600;
    color: var(--accent);
    min-width: 80px;
}

.schedule-content {
    margin-left: 2rem;
}

.schedule-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.schedule-desc {
    color: var(--text-muted);
    font-size: 0.9rem;
}

.toast {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: var(--glass);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 15px;
    padding: 1rem 1.5rem;
    color: var(--text);
    transform: translateX(400px);
    transition: all 0.3s ease;
    z-index: 1002;
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

.nutrition-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.nutrition-card {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.nutrition-card:hover {
    transform: translateY(-5px);
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
}

.nutrition-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.nutrition-card h6 {
    color: var(--text);
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
}

.nutrition-card p {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
}

.nutrition-card strong {
    color: var(--accent);
    font-weight: 600;
}

.nutrition-tag {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.nutrition-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .nutrition-grid {
        grid-template-columns: 1fr;
    }
    
    .dashboard-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .dashboard-controls {
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
    }
    
    .voice-coach-toggle {
        justify-content: center;
    }
    
    .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .recommendations-grid, .actions-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .schedule-item {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .schedule-content {
        margin-left: 0;
        margin-top: 0.5rem;
    }
}
`;

const dashboardStyle = document.createElement('style');
dashboardStyle.textContent = dashboardCSS;
document.head.appendChild(dashboardStyle);