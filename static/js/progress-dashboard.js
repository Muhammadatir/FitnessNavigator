// Advanced Progress Dashboard with Visual Analytics
class ProgressDashboard {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('fitnessProgress') || '{}');
        this.init();
    }

    init() {
        this.createDashboard();
        this.loadProgressData();
        this.startRealTimeUpdates();
    }

    createDashboard() {
        const dashboardHTML = `
            <div class="progress-dashboard">
                <div class="dashboard-header">
                    <h2 class="dashboard-title">Your Fitness Journey</h2>
                    <div class="dashboard-controls">
                        <select id="timeRange" class="time-selector">
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card glass-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-value" id="calories-burned">0</div>
                        <div class="stat-label">Calories Burned</div>
                        <div class="stat-change positive">+12% from last week</div>
                    </div>

                    <div class="stat-card glass-card">
                        <div class="stat-icon">💪</div>
                        <div class="stat-value" id="workouts-completed">0</div>
                        <div class="stat-label">Workouts Completed</div>
                        <div class="stat-change positive">+3 this week</div>
                    </div>

                    <div class="stat-card glass-card">
                        <div class="stat-icon">⚖️</div>
                        <div class="stat-value" id="weight-change">0</div>
                        <div class="stat-label">Weight Change (lbs)</div>
                        <div class="stat-change negative">-2.3 this month</div>
                    </div>

                    <div class="stat-card glass-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-value" id="goal-progress">0</div>
                        <div class="stat-label">Goal Progress</div>
                        <div class="stat-change positive">75% complete</div>
                    </div>
                </div>

                <div class="charts-grid">
                    <div class="chart-card glass-card">
                        <h3>Weekly Activity</h3>
                        <canvas id="activityChart" width="400" height="200"></canvas>
                    </div>

                    <div class="chart-card glass-card">
                        <h3>Body Composition</h3>
                        <div class="body-composition">
                            <div class="composition-item">
                                <div class="composition-ring">
                                    <svg width="100" height="100">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#muscleGradient)" stroke-width="8" 
                                                stroke-dasharray="251" stroke-dashoffset="75" transform="rotate(-90 50 50)"/>
                                        <defs>
                                            <linearGradient id="muscleGradient">
                                                <stop offset="0%" stop-color="#4facfe"/>
                                                <stop offset="100%" stop-color="#00f2fe"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div class="ring-label">
                                        <div class="ring-value">32%</div>
                                        <div class="ring-text">Muscle</div>
                                    </div>
                                </div>
                            </div>
                            <div class="composition-item">
                                <div class="composition-ring">
                                    <svg width="100" height="100">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#fatGradient)" stroke-width="8" 
                                                stroke-dasharray="251" stroke-dashoffset="125" transform="rotate(-90 50 50)"/>
                                        <defs>
                                            <linearGradient id="fatGradient">
                                                <stop offset="0%" stop-color="#f093fb"/>
                                                <stop offset="100%" stop-color="#f5576c"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div class="ring-label">
                                        <div class="ring-value">18%</div>
                                        <div class="ring-text">Body Fat</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="achievements-section">
                    <h3>Recent Achievements</h3>
                    <div class="achievements-grid">
                        <div class="achievement-card glass-card">
                            <div class="achievement-icon">🏆</div>
                            <div class="achievement-title">Week Warrior</div>
                            <div class="achievement-desc">Completed 5 workouts this week</div>
                        </div>
                        <div class="achievement-card glass-card">
                            <div class="achievement-icon">🔥</div>
                            <div class="achievement-title">Calorie Crusher</div>
                            <div class="achievement-desc">Burned 500+ calories in one session</div>
                        </div>
                        <div class="achievement-card glass-card">
                            <div class="achievement-icon">📈</div>
                            <div class="achievement-title">Progress Master</div>
                            <div class="achievement-desc">Lost 5 pounds this month</div>
                        </div>
                    </div>
                </div>

                <div class="insights-section">
                    <h3>AI Insights</h3>
                    <div class="insights-grid">
                        <div class="insight-card glass-card">
                            <div class="insight-icon">🧠</div>
                            <div class="insight-content">
                                <h4>Optimal Workout Time</h4>
                                <p>Your performance peaks at 6 PM. Consider scheduling intense workouts then.</p>
                            </div>
                        </div>
                        <div class="insight-card glass-card">
                            <div class="insight-icon">📊</div>
                            <div class="insight-content">
                                <h4>Recovery Pattern</h4>
                                <p>You recover 23% faster after leg days. Plan accordingly for better results.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert dashboard into page
        const container = document.querySelector('.container') || document.body;
        const dashboardDiv = document.createElement('div');
        dashboardDiv.innerHTML = dashboardHTML;
        container.appendChild(dashboardDiv);
    }

    loadProgressData() {
        // Simulate loading real progress data
        this.animateCounters();
        this.createActivityChart();
        this.updateBodyComposition();
    }

    animateCounters() {
        const counters = [
            { id: 'calories-burned', target: 2847, suffix: '' },
            { id: 'workouts-completed', target: 12, suffix: '' },
            { id: 'weight-change', target: -2.3, suffix: '' },
            { id: 'goal-progress', target: 75, suffix: '%' }
        ];

        counters.forEach(counter => {
            const element = document.getElementById(counter.id);
            if (element) {
                this.animateValue(element, 0, counter.target, 2000, counter.suffix);
            }
        });
    }

    animateValue(element, start, end, duration, suffix = '') {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current * 10) / 10 + suffix;
        }, 16);
    }

    createActivityChart() {
        const canvas = document.getElementById('activityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = [65, 45, 80, 55, 70, 85, 60]; // Weekly activity data
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set up chart dimensions
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const barWidth = chartWidth / data.length;

        // Draw bars
        data.forEach((value, index) => {
            const barHeight = (value / 100) * chartHeight;
            const x = padding + index * barWidth + barWidth * 0.2;
            const y = canvas.height - padding - barHeight;
            const width = barWidth * 0.6;

            // Create gradient
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#4facfe');
            gradient.addColorStop(1, '#00f2fe');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, width, barHeight);

            // Draw labels
            ctx.fillStyle = '#b0b0b0';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], x + width / 2, canvas.height - 10);
            ctx.fillText(value + '%', x + width / 2, y - 10);
        });
    }

    updateBodyComposition() {
        // Animate progress rings
        const muscleRing = document.querySelector('#muscleGradient').parentElement;
        const fatRing = document.querySelector('#fatGradient').parentElement;

        if (muscleRing && fatRing) {
            setTimeout(() => {
                muscleRing.style.strokeDashoffset = '75';
                fatRing.style.strokeDashoffset = '125';
            }, 500);
        }
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateLiveStats();
        }, 30000);
    }

    updateLiveStats() {
        // Simulate live data updates
        const caloriesEl = document.getElementById('calories-burned');
        if (caloriesEl) {
            const currentValue = parseInt(caloriesEl.textContent);
            const newValue = currentValue + Math.floor(Math.random() * 10);
            this.animateValue(caloriesEl, currentValue, newValue, 1000);
        }
    }

    // Method to add new workout data
    addWorkoutData(workout) {
        const today = new Date().toDateString();
        if (!this.userData[today]) {
            this.userData[today] = { workouts: [], calories: 0, duration: 0 };
        }
        
        this.userData[today].workouts.push(workout);
        this.userData[today].calories += workout.calories || 0;
        this.userData[today].duration += workout.duration || 0;
        
        localStorage.setItem('fitnessProgress', JSON.stringify(this.userData));
        this.loadProgressData(); // Refresh dashboard
    }

    // Method to update body metrics
    updateBodyMetrics(weight, bodyFat, muscle) {
        const today = new Date().toDateString();
        if (!this.userData[today]) {
            this.userData[today] = { workouts: [], calories: 0, duration: 0 };
        }
        
        this.userData[today].weight = weight;
        this.userData[today].bodyFat = bodyFat;
        this.userData[today].muscle = muscle;
        
        localStorage.setItem('fitnessProgress', JSON.stringify(this.userData));
        this.updateBodyComposition();
    }
}

// Initialize Progress Dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/progress' || document.querySelector('.progress-page')) {
        new ProgressDashboard();
    }
});

// Add CSS for Progress Dashboard
const progressCSS = `
.progress-dashboard {
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

.time-selector {
    background: var(--glass);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 10px;
    padding: 0.5rem 1rem;
    color: var(--text);
    font-size: 0.9rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    padding: 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
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

.stat-change.negative {
    color: #f5576c;
}

.charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.chart-card {
    padding: 2rem;
}

.chart-card h3 {
    margin-bottom: 1.5rem;
    color: var(--text);
}

.body-composition {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.composition-ring {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ring-label {
    position: absolute;
    text-align: center;
}

.ring-value {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--text);
}

.ring-text {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.achievements-section, .insights-section {
    margin-bottom: 2rem;
}

.achievements-section h3, .insights-section h3 {
    margin-bottom: 1.5rem;
    color: var(--text);
    font-size: 1.5rem;
}

.achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.achievement-card {
    padding: 1.5rem;
    text-align: center;
}

.achievement-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.achievement-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text);
}

.achievement-desc {
    font-size: 0.9rem;
    color: var(--text-muted);
}

.insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.insight-card {
    padding: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.insight-icon {
    font-size: 1.5rem;
    margin-top: 0.25rem;
}

.insight-content h4 {
    margin-bottom: 0.5rem;
    color: var(--text);
}

.insight-content p {
    color: var(--text-muted);
    font-size: 0.9rem;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
    
    .dashboard-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
`;

const progressStyle = document.createElement('style');
progressStyle.textContent = progressCSS;
document.head.appendChild(progressStyle);