// Social Fitness Challenges - Gamification System
class SocialChallenges {
    constructor() {
        this.userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
        this.challenges = this.loadChallenges();
        this.leaderboard = this.loadLeaderboard();
        this.init();
    }

    init() {
        this.createChallengeUI();
        this.loadActiveChallenges();
        this.startRealTimeUpdates();
    }

    loadChallenges() {
        return [
            {
                id: 'weekly-warrior',
                title: '💪 Weekly Warrior',
                description: 'Complete 5 workouts this week',
                type: 'weekly',
                target: 5,
                current: 3,
                reward: 100,
                participants: 1247,
                timeLeft: '2 days',
                difficulty: 'Medium'
            },
            {
                id: 'calorie-crusher',
                title: '🔥 Calorie Crusher',
                description: 'Burn 3000 calories this month',
                type: 'monthly',
                target: 3000,
                current: 1850,
                reward: 250,
                participants: 892,
                timeLeft: '12 days',
                difficulty: 'Hard'
            },
            {
                id: 'step-master',
                title: '👟 Step Master',
                description: 'Walk 10,000 steps daily for 7 days',
                type: 'streak',
                target: 7,
                current: 4,
                reward: 150,
                participants: 2156,
                timeLeft: '3 days',
                difficulty: 'Easy'
            },
            {
                id: 'protein-pro',
                title: '🥩 Protein Pro',
                description: 'Hit protein goals 5 days straight',
                type: 'nutrition',
                target: 5,
                current: 2,
                reward: 75,
                participants: 634,
                timeLeft: '5 days',
                difficulty: 'Medium'
            }
        ];
    }

    loadLeaderboard() {
        return [
            { rank: 1, name: 'FitBeast92', points: 2847, avatar: '🦁', streak: 23 },
            { rank: 2, name: 'IronMike', points: 2634, avatar: '💪', streak: 18 },
            { rank: 3, name: 'CardioQueen', points: 2521, avatar: '👑', streak: 31 },
            { rank: 4, name: 'You', points: 2156, avatar: '🔥', streak: 12 },
            { rank: 5, name: 'FlexMaster', points: 2089, avatar: '🤸', streak: 9 },
            { rank: 6, name: 'ProteinPower', points: 1967, avatar: '🥩', streak: 15 },
            { rank: 7, name: 'YogaZen', points: 1834, avatar: '🧘', streak: 27 },
            { rank: 8, name: 'RunnerHigh', points: 1756, avatar: '🏃', streak: 6 }
        ];
    }

    createChallengeUI() {
        const challengeHTML = `
            <div class="challenges-container">
                <div class="challenges-header">
                    <h2 class="challenges-title">🏆 Fitness Challenges</h2>
                    <div class="user-stats">
                        <div class="stat-item">
                            <span class="stat-value">${this.userStats.points || 2156}</span>
                            <span class="stat-label">Points</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.userStats.rank || 4}</span>
                            <span class="stat-label">Rank</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.userStats.streak || 12}</span>
                            <span class="stat-label">Streak</span>
                        </div>
                    </div>
                </div>

                <div class="challenges-tabs">
                    <button class="tab-btn active" data-tab="active">Active Challenges</button>
                    <button class="tab-btn" data-tab="leaderboard">Leaderboard</button>
                    <button class="tab-btn" data-tab="achievements">Achievements</button>
                </div>

                <div class="tab-content active" id="active-tab">
                    <div class="challenges-grid" id="challenges-grid">
                        <!-- Challenges will be loaded here -->
                    </div>
                </div>

                <div class="tab-content" id="leaderboard-tab">
                    <div class="leaderboard-container">
                        <div class="leaderboard-header">
                            <h3>🏆 Global Leaderboard</h3>
                            <select class="time-filter">
                                <option value="weekly">This Week</option>
                                <option value="monthly">This Month</option>
                                <option value="alltime">All Time</option>
                            </select>
                        </div>
                        <div class="leaderboard-list" id="leaderboard-list">
                            <!-- Leaderboard will be loaded here -->
                        </div>
                    </div>
                </div>

                <div class="tab-content" id="achievements-tab">
                    <div class="achievements-container">
                        <h3>🏅 Your Achievements</h3>
                        <div class="achievements-grid" id="achievements-grid">
                            <!-- Achievements will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert into page
        const container = document.querySelector('.challenges-page .container') || document.querySelector('.container') || document.body;
        container.innerHTML = challengeHTML;

        this.bindEvents();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Challenge actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('join-challenge') || e.target.closest('.join-challenge')) {
                const button = e.target.classList.contains('join-challenge') ? e.target : e.target.closest('.join-challenge');
                const challengeId = button.dataset.challengeId;
                this.joinChallenge(challengeId);
                e.preventDefault();
                e.stopPropagation();
            }
            if (e.target.classList.contains('share-progress') || e.target.closest('.share-progress')) {
                const button = e.target.classList.contains('share-progress') ? e.target : e.target.closest('.share-progress');
                const challengeId = button.dataset.challengeId;
                this.shareProgress(challengeId);
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // Add hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('btn-modern') || e.target.classList.contains('btn-secondary')) {
                e.target.style.transform = 'scale(1.05)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('btn-modern') || e.target.classList.contains('btn-secondary')) {
                e.target.style.transform = 'scale(1)';
            }
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Load content based on tab
        switch(tabName) {
            case 'active':
                this.loadActiveChallenges();
                break;
            case 'leaderboard':
                this.loadLeaderboard();
                break;
            case 'achievements':
                this.loadAchievements();
                break;
        }
    }

    loadActiveChallenges() {
        const grid = document.getElementById('challenges-grid');
        if (!grid) return;

        grid.innerHTML = this.challenges.map(challenge => `
            <div class="challenge-card glass-card">
                <div class="challenge-header">
                    <div class="challenge-title">${challenge.title}</div>
                    <div class="challenge-difficulty ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</div>
                </div>
                
                <div class="challenge-description">${challenge.description}</div>
                
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(challenge.current / challenge.target) * 100}%"></div>
                    </div>
                    <div class="progress-text">${challenge.current} / ${challenge.target}</div>
                </div>
                
                <div class="challenge-meta">
                    <div class="meta-item">
                        <span class="meta-icon">👥</span>
                        <span>${challenge.participants.toLocaleString()} joined</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">⏰</span>
                        <span>${challenge.timeLeft} left</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">🏆</span>
                        <span>${challenge.reward} points</span>
                    </div>
                </div>
                
                <div class="challenge-actions">
                    <button class="btn-modern join-challenge" data-challenge-id="${challenge.id}" ${challenge.current >= challenge.target ? 'disabled' : ''}>
                        ${challenge.current >= challenge.target ? 'Completed ✅' : challenge.current > 0 ? 'Continue' : 'Join Challenge'}
                    </button>
                    <button class="btn-secondary share-progress" data-challenge-id="${challenge.id}">
                        Share
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        if (!list) return;

        list.innerHTML = this.leaderboard.map(user => `
            <div class="leaderboard-item ${user.name === 'You' ? 'current-user' : ''}">
                <div class="rank-badge ${user.rank <= 3 ? 'top-rank' : ''}">${user.rank}</div>
                <div class="user-avatar">${user.avatar}</div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-streak">🔥 ${user.streak} day streak</div>
                </div>
                <div class="user-points">${user.points.toLocaleString()} pts</div>
            </div>
        `).join('');
    }

    loadAchievements() {
        const achievements = [
            { id: 'first-workout', title: 'First Steps', description: 'Complete your first workout', icon: '🎯', unlocked: true },
            { id: 'week-warrior', title: 'Week Warrior', description: 'Complete 5 workouts in a week', icon: '💪', unlocked: true },
            { id: 'calorie-burner', title: 'Calorie Burner', description: 'Burn 1000 calories in a day', icon: '🔥', unlocked: true },
            { id: 'consistency-king', title: 'Consistency King', description: '30-day workout streak', icon: '👑', unlocked: false },
            { id: 'nutrition-ninja', title: 'Nutrition Ninja', description: 'Log meals for 14 days straight', icon: '🥗', unlocked: false },
            { id: 'social-butterfly', title: 'Social Butterfly', description: 'Share 10 workout posts', icon: '🦋', unlocked: false }
        ];

        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        grid.innerHTML = achievements.map(achievement => `
            <div class="achievement-card glass-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
                ${achievement.unlocked ? '<div class="achievement-status">✅ Unlocked</div>' : '<div class="achievement-status">🔒 Locked</div>'}
            </div>
        `).join('');
    }

    joinChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;

        // Check if challenge is already completed
        if (challenge.current >= challenge.target) {
            this.showNotification(`✅ Challenge already completed!`, 'info');
            return;
        }

        // Simulate joining challenge
        challenge.participants += 1;
        
        // Different increment based on challenge type
        let increment = 1;
        if (challengeId === 'calorie-crusher') {
            increment = 30; // 30 calories for calorie crusher
        }
        
        challenge.current = Math.min(challenge.current + increment, challenge.target); // Limit to target
        
        // Show success message
        const isCompleted = challenge.current >= challenge.target;
        if (isCompleted) {
            this.showNotification(`🏆 Challenge completed! You earned ${challenge.reward} points!`, 'success');
            this.completeChallenge(challengeId);
        } else {
            this.showNotification(`🎉 Progress updated! ${challenge.current}/${challenge.target}`, 'success');
        }
        
        // Update UI
        this.loadActiveChallenges();
        
        // Add to user's active challenges
        const userChallenges = JSON.parse(localStorage.getItem('userChallenges') || '[]');
        if (!userChallenges.includes(challengeId)) {
            userChallenges.push(challengeId);
            localStorage.setItem('userChallenges', JSON.stringify(userChallenges));
        }

        // Update user points only if not completed
        if (!isCompleted) {
            this.userStats.points = (this.userStats.points || 2156) + 10;
            localStorage.setItem('userStats', JSON.stringify(this.userStats));
            
            // Update stats display
            const pointsElement = document.querySelector('.stat-value');
            if (pointsElement) {
                pointsElement.textContent = this.userStats.points;
            }
        }
    }

    shareProgress(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;

        const progressPercent = Math.round((challenge.current / challenge.target) * 100);
        const shareText = `💪 I'm ${progressPercent}% through the "${challenge.title}" challenge! Join me on FitnessNavigator! #FitnessChallenge #HealthyLifestyle`;

        if (navigator.share) {
            navigator.share({
                title: 'My Fitness Progress',
                text: shareText,
                url: window.location.href
            }).then(() => {
                this.showNotification('📤 Progress shared successfully!', 'success');
            }).catch(() => {
                this.copyToClipboard(shareText);
            });
        } else {
            this.copyToClipboard(shareText);
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('📋 Progress copied to clipboard!', 'info');
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.showNotification('📋 Progress copied to clipboard!', 'info');
        } catch (err) {
            this.showNotification('❌ Could not copy to clipboard', 'error');
        }
        document.body.removeChild(textArea);
    }

    updateChallengeProgress(challengeId, progress) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (challenge) {
            challenge.current = Math.min(challenge.current + progress, challenge.target);
            
            // Check if challenge is completed
            if (challenge.current >= challenge.target) {
                this.completeChallenge(challengeId);
            }
            
            this.loadActiveChallenges();
        }
    }

    completeChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;

        // Award points
        this.userStats.points = (this.userStats.points || 0) + challenge.reward;
        localStorage.setItem('userStats', JSON.stringify(this.userStats));

        // Show completion notification
        this.showNotification(`🏆 Challenge Complete! You earned ${challenge.reward} points!`, 'success');

        // Trigger celebration animation
        this.triggerCelebration();
    }

    triggerCelebration() {
        // Create confetti effect
        const confetti = document.createElement('div');
        confetti.className = 'confetti-container';
        confetti.innerHTML = '🎉'.repeat(20);
        document.body.appendChild(confetti);

        setTimeout(() => {
            document.body.removeChild(confetti);
        }, 3000);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateLiveStats();
        }, 30000);
    }

    updateLiveStats() {
        // Simulate live participant updates
        this.challenges.forEach(challenge => {
            challenge.participants += Math.floor(Math.random() * 5);
        });
        
        this.loadActiveChallenges();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 4000);
    }

    // Public methods for integration with other features
    addWorkoutPoints(points = 50) {
        this.userStats.points = (this.userStats.points || 0) + points;
        this.userStats.streak = (this.userStats.streak || 0) + 1;
        localStorage.setItem('userStats', JSON.stringify(this.userStats));
        
        // Update relevant challenges
        this.updateChallengeProgress('weekly-warrior', 1);
        this.updateChallengeProgress('step-master', 1);
    }

    addNutritionPoints(points = 25) {
        this.userStats.points = (this.userStats.points || 0) + points;
        localStorage.setItem('userStats', JSON.stringify(this.userStats));
        
        // Update nutrition challenges
        this.updateChallengeProgress('protein-pro', 1);
    }

    addCaloriesBurned(calories) {
        this.updateChallengeProgress('calorie-crusher', calories);
    }
}

// Initialize Social Challenges
let socialChallenges;
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/challenges' || document.querySelector('.challenges-page')) {
        socialChallenges = new SocialChallenges();
    }
});

// Add CSS for Social Challenges
const challengesCSS = `
.challenges-container {
    padding: 2rem 0;
    max-width: 1200px;
    margin: 0 auto;
}

.challenges-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.challenges-title {
    font-size: 2.5rem;
    font-weight: 800;
    background: var(--primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.user-stats {
    display: flex;
    gap: 2rem;
}

.stat-item {
    text-align: center;
}

.stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent);
}

.stat-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
}

.challenges-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
    padding: 1rem 2rem;
    background: none;
    border: none;
    color: var(--text-muted);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
}

.tab-btn.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.challenges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    justify-items: center;
}

.challenge-card {
    padding: 2rem;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 400px;
}

.challenge-card:hover {
    transform: translateY(-5px);
}

.challenge-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.challenge-title {
    font-size: 1.2rem;
    font-weight: 600;
}

.challenge-difficulty {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.challenge-difficulty.easy {
    background: rgba(0, 242, 254, 0.2);
    color: #00f2fe;
}

.challenge-difficulty.medium {
    background: rgba(245, 87, 108, 0.2);
    color: #f5576c;
}

.challenge-difficulty.hard {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
}

.challenge-description {
    color: var(--text-muted);
    margin-bottom: 1.5rem;
}

.challenge-progress {
    margin-bottom: 1.5rem;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: var(--success);
    transition: width 0.3s ease;
}

.progress-text {
    text-align: center;
    font-weight: 600;
    color: var(--accent);
}

.challenge-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: var(--text-muted);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.challenge-actions {
    display: flex;
    gap: 1rem;
}

.btn-secondary {
    background: var(--glass);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: var(--text);
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
}

.leaderboard-container {
    max-width: 600px;
    margin: 0 auto;
}

.leaderboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.time-filter {
    background: var(--glass);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 10px;
    padding: 0.5rem 1rem;
    color: var(--text);
}

.leaderboard-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: var(--glass);
    border-radius: 15px;
    transition: all 0.3s ease;
}

.leaderboard-item.current-user {
    border: 2px solid var(--accent);
    background: rgba(0, 212, 255, 0.1);
}

.rank-badge {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    background: var(--glass);
}

.rank-badge.top-rank {
    background: var(--success);
    color: white;
}

.user-avatar {
    font-size: 2rem;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--glass);
    border-radius: 50%;
}

.user-info {
    flex: 1;
}

.user-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.user-streak {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.user-points {
    font-weight: 700;
    color: var(--accent);
}

.achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.achievement-card {
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
}

.achievement-card.locked {
    opacity: 0.5;
    filter: grayscale(100%);
}

.achievement-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.achievement-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.achievement-description {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.achievement-status {
    font-weight: 600;
    font-size: 0.9rem;
}

.notification {
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

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left: 4px solid #00f2fe;
}

.notification.info {
    border-left: 4px solid #667eea;
}

.confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    font-size: 2rem;
    animation: confetti-fall 3s ease-out;
}

@keyframes confetti-fall {
    0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .challenges-container {
        padding: 1rem;
    }
    
    .challenges-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .user-stats {
        justify-content: center;
        gap: 1rem;
    }
    
    .challenges-tabs {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
    }
    
    .challenges-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .challenge-card {
        padding: 1.5rem;
        max-width: none;
    }
    
    .challenge-meta {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
    
    .challenge-actions {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .leaderboard-item {
        padding: 0.75rem;
    }
    
    .achievements-grid {
        grid-template-columns: 1fr;
    }
}
`;

const challengesStyle = document.createElement('style');
challengesStyle.textContent = challengesCSS;
document.head.appendChild(challengesStyle);