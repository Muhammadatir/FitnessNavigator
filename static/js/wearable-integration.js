// Wearable Device Integration - Game Changer Feature
class WearableIntegration {
    constructor() {
        this.connectedDevices = JSON.parse(localStorage.getItem('connectedDevices') || JSON.stringify(this.getDefaultDevices()));
        this.healthData = JSON.parse(localStorage.getItem('healthData') || '{}');
        this.isWebBluetoothSupported = 'bluetooth' in navigator;
        this.init();
    }

    getDefaultDevices() {
        return [
            {
                id: 'apple-watch-1',
                type: 'apple-watch',
                name: 'Apple Watch Series 9',
                connected: true,
                lastSync: new Date().toISOString(),
                battery: 87
            },
            {
                id: 'fitbit-1',
                type: 'fitbit',
                name: 'Fitbit Charge 5',
                connected: true,
                lastSync: new Date(Date.now() - 300000).toISOString(),
                battery: 72
            },
            {
                id: 'oura-1',
                type: 'oura',
                name: 'Oura Ring Gen3',
                connected: true,
                lastSync: new Date(Date.now() - 600000).toISOString(),
                battery: 94
            },
            {
                id: 'garmin-1',
                type: 'garmin',
                name: 'Garmin Forerunner 955',
                connected: false,
                lastSync: new Date(Date.now() - 3600000).toISOString(),
                battery: 45
            }
        ];
    }

    init() {
        this.createWearableUI();
        this.loadConnectedDevices();
        this.startHealthDataSync();
        this.bindEvents();
    }

    createWearableUI() {
        const wearableHTML = `
            <div class="wearable-integration">
                <div class="back-button-container">
                    <button class="btn-back" onclick="history.back()">← Back to Dashboard</button>
                </div>
                <div class="wearable-header">
                    <h2 class="wearable-title">⌚ Connected Devices</h2>
                    <button class="btn-modern" id="add-device-btn">+ Add Device</button>
                </div>

                <div class="devices-grid" id="devices-grid">
                    <!-- Connected devices will be loaded here -->
                </div>

                <div class="health-metrics">
                    <h3>📊 Real-Time Health Metrics</h3>
                    <div class="metrics-grid">
                        <div class="metric-card glass-card">
                            <div class="metric-icon">❤️</div>
                            <div class="metric-value" id="heart-rate">--</div>
                            <div class="metric-label">Heart Rate (BPM)</div>
                            <div class="metric-trend" id="hr-trend">--</div>
                        </div>

                        <div class="metric-card glass-card">
                            <div class="metric-icon">👟</div>
                            <div class="metric-value" id="steps">--</div>
                            <div class="metric-label">Steps Today</div>
                            <div class="metric-trend" id="steps-trend">--</div>
                        </div>

                        <div class="metric-card glass-card">
                            <div class="metric-icon">🔥</div>
                            <div class="metric-value" id="calories">--</div>
                            <div class="metric-label">Calories Burned</div>
                            <div class="metric-trend" id="calories-trend">--</div>
                        </div>

                        <div class="metric-card glass-card">
                            <div class="metric-icon">😴</div>
                            <div class="metric-value" id="sleep-score">--</div>
                            <div class="metric-label">Sleep Score</div>
                            <div class="metric-trend" id="sleep-trend">--</div>
                        </div>

                        <div class="metric-card glass-card">
                            <div class="metric-icon">🧘</div>
                            <div class="metric-value" id="stress-level">--</div>
                            <div class="metric-label">Stress Level</div>
                            <div class="metric-trend" id="stress-trend">--</div>
                        </div>

                        <div class="metric-card glass-card">
                            <div class="metric-icon">💧</div>
                            <div class="metric-value" id="hydration">--</div>
                            <div class="metric-label">Hydration %</div>
                            <div class="metric-trend" id="hydration-trend">--</div>
                        </div>
                    </div>
                </div>

                <div class="workout-zones">
                    <h3>🎯 Heart Rate Zones</h3>
                    <div class="zones-container">
                        <div class="zone-bar">
                            <div class="zone zone-1" data-zone="Recovery">Recovery (50-60%)</div>
                            <div class="zone zone-2" data-zone="Fat Burn">Fat Burn (60-70%)</div>
                            <div class="zone zone-3" data-zone="Aerobic">Aerobic (70-80%)</div>
                            <div class="zone zone-4" data-zone="Anaerobic">Anaerobic (80-90%)</div>
                            <div class="zone zone-5" data-zone="Max">Max (90-100%)</div>
                        </div>
                        <div class="current-zone" id="current-zone">
                            <div class="zone-indicator"></div>
                            <span id="zone-text">Resting</span>
                        </div>
                    </div>
                </div>

                <div class="ai-insights">
                    <h3>🧠 AI Health Insights</h3>
                    <div class="insights-container" id="health-insights">
                        <!-- AI insights will be loaded here -->
                    </div>
                </div>
            </div>

            <!-- Add Device Modal -->
            <div class="modal fade" id="addDeviceModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content glass-card">
                        <div class="modal-header">
                            <h5 class="modal-title">⌚ Connect New Device</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="device-types">
                                <div class="device-type" data-type="apple-watch">
                                    <div class="device-icon">⌚</div>
                                    <h6>Apple Watch</h6>
                                    <p>Heart rate, steps, workouts</p>
                                </div>
                                <div class="device-type" data-type="fitbit">
                                    <div class="device-icon">📱</div>
                                    <h6>Fitbit</h6>
                                    <p>Activity, sleep, heart rate</p>
                                </div>
                                <div class="device-type" data-type="garmin">
                                    <div class="device-icon">🏃</div>
                                    <h6>Garmin</h6>
                                    <p>GPS, training metrics</p>
                                </div>
                                <div class="device-type" data-type="oura">
                                    <div class="device-icon">💍</div>
                                    <h6>Oura Ring</h6>
                                    <p>Sleep, recovery, readiness</p>
                                </div>
                                <div class="device-type" data-type="polar">
                                    <div class="device-icon">❄️</div>
                                    <h6>Polar</h6>
                                    <p>Heart rate, training load</p>
                                </div>
                                <div class="device-type" data-type="whoop">
                                    <div class="device-icon">🔄</div>
                                    <h6>WHOOP</h6>
                                    <p>Strain, recovery, sleep</p>
                                </div>
                                <div class="device-type" data-type="samsung">
                                    <div class="device-icon">📱</div>
                                    <h6>Samsung Galaxy Watch</h6>
                                    <p>Health, fitness, notifications</p>
                                </div>
                                <div class="device-type" data-type="amazfit">
                                    <div class="device-icon">⏱️</div>
                                    <h6>Amazfit</h6>
                                    <p>Sports tracking, health</p>
                                </div>
                                <div class="device-type" data-type="suunto">
                                    <div class="device-icon">🧢</div>
                                    <h6>Suunto</h6>
                                    <p>Adventure sports, GPS</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert into page
        const container = document.querySelector('.container') || document.body;
        const wearableDiv = document.createElement('div');
        wearableDiv.innerHTML = wearableHTML;
        container.appendChild(wearableDiv);
    }

    bindEvents() {
        document.getElementById('add-device-btn').addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('addDeviceModal'));
            modal.show();
        });

        document.querySelectorAll('.device-type').forEach(deviceType => {
            deviceType.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.connectDevice(type);
            });
        });
    }

    async connectDevice(deviceType) {
        try {
            // Simulate device connection process
            this.showConnectionProgress(deviceType);
            
            // In a real app, this would connect to actual APIs
            await this.simulateDeviceConnection(deviceType);
            
            const device = {
                id: Date.now().toString(),
                type: deviceType,
                name: this.getDeviceName(deviceType),
                connected: true,
                lastSync: new Date().toISOString(),
                battery: Math.floor(Math.random() * 40) + 60 // 60-100%
            };

            this.connectedDevices.push(device);
            localStorage.setItem('connectedDevices', JSON.stringify(this.connectedDevices));
            
            this.loadConnectedDevices();
            this.startDataSync(device);
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('addDeviceModal')).hide();
            
            this.showNotification(`✅ ${device.name} connected successfully!`, 'success');
            
        } catch (error) {
            console.error('Device connection failed:', error);
            this.showNotification(`❌ Failed to connect ${deviceType}. Please try again.`, 'error');
        }
    }

    async simulateDeviceConnection(deviceType) {
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For Web Bluetooth supported devices, try actual connection
        if (this.isWebBluetoothSupported && ['apple-watch', 'polar'].includes(deviceType)) {
            try {
                // This would be actual Bluetooth connection in production
                console.log(`Attempting Bluetooth connection to ${deviceType}`);
            } catch (error) {
                console.log('Bluetooth connection failed, using simulation');
            }
        }
    }

    showConnectionProgress(deviceType) {
        const deviceName = this.getDeviceName(deviceType);
        const progressHTML = `
            <div class="connection-progress">
                <div class="progress-spinner"></div>
                <p>Connecting to ${deviceName}...</p>
                <small>Make sure your device is nearby and discoverable</small>
            </div>
        `;
        
        document.querySelector('#addDeviceModal .modal-body').innerHTML = progressHTML;
    }

    getDeviceName(deviceType) {
        const names = {
            'apple-watch': 'Apple Watch',
            'fitbit': 'Fitbit Device',
            'garmin': 'Garmin Watch',
            'oura': 'Oura Ring',
            'polar': 'Polar Device',
            'whoop': 'WHOOP Strap',
            'samsung': 'Samsung Galaxy Watch',
            'amazfit': 'Amazfit Watch',
            'suunto': 'Suunto Watch'
        };
        return names[deviceType] || 'Unknown Device';
    }

    loadConnectedDevices() {
        const grid = document.getElementById('devices-grid');
        if (!grid) return;

        if (this.connectedDevices.length === 0) {
            grid.innerHTML = `
                <div class="no-devices glass-card">
                    <div class="no-devices-icon">⌚</div>
                    <h4>No Devices Connected</h4>
                    <p>Connect your wearable devices to get real-time health insights and personalized recommendations.</p>
                    <button class="btn-modern" onclick="document.getElementById('add-device-btn').click()">Connect Device</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.connectedDevices.map(device => `
            <div class="device-card glass-card">
                <div class="device-header">
                    <div class="device-info">
                        <div class="device-icon">${this.getDeviceIcon(device.type)}</div>
                        <div>
                            <h5>${device.name}</h5>
                            <span class="device-status ${device.connected ? 'connected' : 'disconnected'}">
                                ${device.connected ? '🟢 Connected' : '🔴 Disconnected'}
                            </span>
                        </div>
                    </div>
                    <div class="device-battery">
                        <div class="battery-icon">🔋</div>
                        <span>${device.battery}%</span>
                    </div>
                </div>
                
                <div class="device-metrics">
                    <div class="metric-item">
                        <span class="metric-label">Last Sync:</span>
                        <span class="metric-value">${this.formatLastSync(device.lastSync)}</span>
                    </div>
                </div>
                
                <div class="device-actions">
                    <button class="btn-secondary btn-sm" onclick="wearableIntegration.syncDevice('${device.id}')">
                        🔄 Sync Now
                    </button>
                    <button class="btn-secondary btn-sm" onclick="wearableIntegration.removeDevice('${device.id}')">
                        🗑️ Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    getDeviceIcon(deviceType) {
        const icons = {
            'apple-watch': '⌚',
            'fitbit': '📱',
            'garmin': '🏃',
            'oura': '💍',
            'polar': '❄️',
            'whoop': '🔄',
            'samsung': '📱',
            'amazfit': '⏱️',
            'suunto': '🧢'
        };
        return icons[deviceType] || '⌚';
    }

    formatLastSync(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    }

    startHealthDataSync() {
        // Simulate real-time health data updates
        this.updateHealthMetrics();
        
        // Update every 30 seconds
        setInterval(() => {
            this.updateHealthMetrics();
        }, 30000);
    }

    updateHealthMetrics() {
        if (this.connectedDevices.length === 0) return;

        // Simulate realistic health data
        const currentTime = new Date().getHours();
        const isWorkoutTime = currentTime >= 6 && currentTime <= 22;
        
        const metrics = {
            heartRate: isWorkoutTime ? 
                Math.floor(Math.random() * 40) + 80 : // 80-120 during active hours
                Math.floor(Math.random() * 20) + 60,  // 60-80 during rest
            steps: Math.floor(Math.random() * 2000) + (currentTime * 500),
            calories: Math.floor(Math.random() * 100) + (currentTime * 80),
            sleepScore: Math.floor(Math.random() * 20) + 75,
            stressLevel: Math.floor(Math.random() * 30) + 20,
            hydration: Math.floor(Math.random() * 20) + 70
        };

        // Update UI
        this.updateMetricDisplay('heart-rate', metrics.heartRate, 'BPM');
        this.updateMetricDisplay('steps', metrics.steps.toLocaleString());
        this.updateMetricDisplay('calories', metrics.calories);
        this.updateMetricDisplay('sleep-score', metrics.sleepScore + '%');
        this.updateMetricDisplay('stress-level', this.getStressLabel(metrics.stressLevel));
        this.updateMetricDisplay('hydration', metrics.hydration + '%');

        // Update heart rate zone
        this.updateHeartRateZone(metrics.heartRate);

        // Store data
        this.healthData[new Date().toISOString()] = metrics;
        localStorage.setItem('healthData', JSON.stringify(this.healthData));

        // Generate AI insights
        this.generateHealthInsights(metrics);
    }

    updateMetricDisplay(elementId, value, suffix = '') {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value + suffix;
            
            // Add pulse animation for heart rate
            if (elementId === 'heart-rate') {
                element.parentElement.classList.add('pulse');
                setTimeout(() => {
                    element.parentElement.classList.remove('pulse');
                }, 1000);
            }
        }
    }

    getStressLabel(stressLevel) {
        if (stressLevel < 25) return 'Low';
        if (stressLevel < 50) return 'Moderate';
        if (stressLevel < 75) return 'High';
        return 'Very High';
    }

    updateHeartRateZone(heartRate) {
        const maxHR = 220 - 30; // Assuming age 30
        const hrPercent = (heartRate / maxHR) * 100;
        
        let zone = 'Resting';
        let zoneClass = 'zone-0';
        
        if (hrPercent >= 90) {
            zone = 'Max Effort';
            zoneClass = 'zone-5';
        } else if (hrPercent >= 80) {
            zone = 'Anaerobic';
            zoneClass = 'zone-4';
        } else if (hrPercent >= 70) {
            zone = 'Aerobic';
            zoneClass = 'zone-3';
        } else if (hrPercent >= 60) {
            zone = 'Fat Burn';
            zoneClass = 'zone-2';
        } else if (hrPercent >= 50) {
            zone = 'Recovery';
            zoneClass = 'zone-1';
        }

        const zoneIndicator = document.querySelector('.zone-indicator');
        const zoneText = document.getElementById('zone-text');
        
        if (zoneIndicator && zoneText) {
            zoneIndicator.className = `zone-indicator ${zoneClass}`;
            zoneText.textContent = zone;
        }
    }

    generateHealthInsights(metrics) {
        const insights = [];
        
        if (metrics.heartRate > 100) {
            insights.push({
                icon: '❤️',
                title: 'Elevated Heart Rate',
                message: 'Your heart rate is elevated. Consider taking a break or doing some deep breathing exercises.',
                type: 'warning'
            });
        }
        
        if (metrics.steps < 5000 && new Date().getHours() > 15) {
            insights.push({
                icon: '👟',
                title: 'Low Activity Alert',
                message: 'You\'re below your daily step goal. Try taking a 10-minute walk to boost your activity.',
                type: 'info'
            });
        }
        
        if (metrics.stressLevel > 70) {
            insights.push({
                icon: '🧘',
                title: 'High Stress Detected',
                message: 'Your stress levels are high. Consider meditation or light exercise to help reduce stress.',
                type: 'warning'
            });
        }
        
        if (metrics.hydration < 60) {
            insights.push({
                icon: '💧',
                title: 'Hydration Reminder',
                message: 'Your hydration levels are low. Drink a glass of water to stay properly hydrated.',
                type: 'info'
            });
        }

        this.displayHealthInsights(insights);
    }

    displayHealthInsights(insights) {
        const container = document.getElementById('health-insights');
        if (!container) return;

        if (insights.length === 0) {
            container.innerHTML = `
                <div class="insight-card glass-card">
                    <div class="insight-icon">✅</div>
                    <div class="insight-content">
                        <h5>All Good!</h5>
                        <p>Your health metrics look great. Keep up the excellent work!</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = insights.map(insight => `
            <div class="insight-card glass-card ${insight.type}">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                    <h5>${insight.title}</h5>
                    <p>${insight.message}</p>
                </div>
            </div>
        `).join('');
    }

    syncDevice(deviceId) {
        const device = this.connectedDevices.find(d => d.id === deviceId);
        if (!device) return;

        device.lastSync = new Date().toISOString();
        localStorage.setItem('connectedDevices', JSON.stringify(this.connectedDevices));
        
        this.loadConnectedDevices();
        this.updateHealthMetrics();
        
        this.showNotification(`🔄 ${device.name} synced successfully!`, 'success');
    }

    removeDevice(deviceId) {
        if (confirm('Are you sure you want to remove this device?')) {
            this.connectedDevices = this.connectedDevices.filter(d => d.id !== deviceId);
            localStorage.setItem('connectedDevices', JSON.stringify(this.connectedDevices));
            
            this.loadConnectedDevices();
            this.showNotification('Device removed successfully', 'info');
        }
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

    // Public methods for integration
    getCurrentHeartRate() {
        const latestData = Object.values(this.healthData).pop();
        return latestData ? latestData.heartRate : null;
    }

    getTodaysSteps() {
        const latestData = Object.values(this.healthData).pop();
        return latestData ? latestData.steps : 0;
    }

    getStressLevel() {
        const latestData = Object.values(this.healthData).pop();
        return latestData ? latestData.stressLevel : null;
    }
}

// Initialize Wearable Integration
let wearableIntegration;
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.wearable-page')) {
        wearableIntegration = new WearableIntegration();
    }
});

// Add CSS for Wearable Integration
const wearableCSS = `
.wearable-integration {
    padding: 1rem;
    max-width: 1400px;
    margin: 0 auto;
    text-align: center;
    min-height: calc(100vh - 120px);
    overflow-x: hidden;
}

.back-button-container {
    text-align: left;
    margin-bottom: 2rem;
}

.btn-back {
    background: var(--glass);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: var(--text);
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-back:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(-2px);
}

.wearable-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    gap: 2rem;
    flex-wrap: wrap;
}

.wearable-title {
    font-size: 2.5rem;
    font-weight: 800;
    background: var(--primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.devices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
    justify-items: center;
    width: 100%;
    max-width: 100%;
}

.device-card {
    padding: 1.5rem;
    min-height: 160px;
    width: 100%;
    max-width: 320px;
}

.device-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.device-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.device-icon {
    font-size: 2rem;
}

.device-status.connected {
    color: #00f2fe;
}

.device-status.disconnected {
    color: #f5576c;
}

.device-battery {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
}

.device-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.no-devices {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.no-devices-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    justify-items: center;
    width: 100%;
}

.metric-card {
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
}

.metric-card.pulse {
    animation: pulse 1s ease;
}

.metric-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.metric-value {
    font-size: 2rem;
    font-weight: 800;
    background: var(--success);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
}

.metric-label {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.metric-trend {
    font-size: 0.8rem;
    font-weight: 600;
}

.zones-container {
    margin-bottom: 3rem;
}

.zone-bar {
    display: flex;
    height: 40px;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.zone {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
}

.zone-1 { background: #4facfe; }
.zone-2 { background: #43e97b; }
.zone-3 { background: #fa709a; }
.zone-4 { background: #ff6b6b; }
.zone-5 { background: #ee5a24; }

.current-zone {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--glass);
    border-radius: 15px;
}

.zone-indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--text-muted);
    transition: all 0.3s ease;
}

.zone-indicator.zone-1 { background: #4facfe; }
.zone-indicator.zone-2 { background: #43e97b; }
.zone-indicator.zone-3 { background: #fa709a; }
.zone-indicator.zone-4 { background: #ff6b6b; }
.zone-indicator.zone-5 { background: #ee5a24; }

.insights-container {
    display: grid;
    gap: 1rem;
}

.insight-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
}

.insight-card.warning {
    border-left: 4px solid #f5576c;
}

.insight-card.info {
    border-left: 4px solid #4facfe;
}

.insight-icon {
    font-size: 1.5rem;
}

.insight-content h5 {
    margin-bottom: 0.5rem;
}

.insight-content p {
    color: var(--text-muted);
    margin: 0;
}

.device-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.device-type {
    padding: 1.5rem;
    text-align: center;
    background: var(--glass);
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.device-type:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
}

.device-type .device-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.device-type h6 {
    margin-bottom: 0.5rem;
}

.device-type p {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin: 0;
}

.connection-progress {
    text-align: center;
    padding: 2rem;
}

.progress-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top: 3px solid var(--accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .wearable-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .metrics-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
    
    .zone-bar {
        flex-direction: column;
        height: auto;
    }
    
    .zone {
        height: 30px;
    }
    
    .device-types {
        grid-template-columns: 1fr;
    }
}
`;

const wearableStyle = document.createElement('style');
wearableStyle.textContent = wearableCSS + `
@media (max-width: 768px) {
    .wearable-integration {
        padding: 0.5rem;
    }
    
    .back-button-container {
        text-align: left;
        margin-bottom: 1rem;
    }
    
    .wearable-header {
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .devices-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .device-card {
        max-width: 100%;
        padding: 1rem;
    }
    
    .metrics-grid {
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 0.75rem;
    }
}
`;
document.head.appendChild(wearableStyle);