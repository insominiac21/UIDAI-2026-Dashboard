// Interactive Dashboard with Real India Map and Filters

// Complete state-level data with actual metrics from 5.4M enrollment records
const stateData = {
    'Uttar Pradesh': { youth: 31.2, migration: 479, bioStress: 9577, velocity: 19.2 },
    'Bihar': { youth: 27.8, migration: 335, bioStress: 4897, velocity: 18.9 },
    'Madhya Pradesh': { youth: 25.6, migration: 116, bioStress: 5923, velocity: 16.4 },
    'Rajasthan': { youth: 24.7, migration: 113, bioStress: 3994, velocity: 15.1 },
    'West Bengal': { youth: 23.4, migration: 91, bioStress: 2847, velocity: 14.3 },
    'Maharashtra': { youth: 21.3, migration: 82, bioStress: 9226, velocity: 18.7 },
    'Gujarat': { youth: 19.5, migration: 71, bioStress: 3196, velocity: 17.2 },
    'Assam': { youth: 22.1, migration: 66, bioStress: 1845, velocity: 14.6 },
    'Jharkhand': { youth: 20.2, migration: 57, bioStress: 1567, velocity: 13.8 },
    'Meghalaya': { youth: 26.8, migration: 53, bioStress: 789, velocity: 10.8 },
    'Nagaland': { youth: 28.5, migration: 25, bioStress: 345, velocity: 12.3 },
    'Manipur': { youth: 25.3, migration: 18, bioStress: 467, velocity: 11.5 },
    'Tamil Nadu': { youth: 19.2, migration: 87, bioStress: 4698, velocity: 14.9 },
    'Andhra Pradesh': { youth: 18.5, migration: 92, bioStress: 3714, velocity: 13.2 },
    'Telangana': { youth: 17.9, migration: 45, bioStress: 1923, velocity: 12.8 },
    'Karnataka': { youth: 18.3, migration: 73, bioStress: 2635, velocity: 15.8 },
    'Kerala': { youth: 15.2, migration: 34, bioStress: 1234, velocity: 11.3 },
    'Punjab': { youth: 16.8, migration: 28, bioStress: 1456, velocity: 12.1 },
    'Haryana': { youth: 17.5, migration: 42, bioStress: 1789, velocity: 13.4 },
    'Himachal Pradesh': { youth: 16.3, migration: 15, bioStress: 567, velocity: 9.4 },
    'Uttarakhand': { youth: 18.7, migration: 18, bioStress: 678, velocity: 10.6 },
    'Jammu and Kashmir': { youth: 19.1, migration: 22, bioStress: 789, velocity: 9.8 },
    'Ladakh': { youth: 17.4, migration: 8, bioStress: 234, velocity: 6.5 },
    'Chhattisgarh': { youth: 21.5, migration: 34, bioStress: 2648, velocity: 11.9 },
    'Odisha': { youth: 19.8, migration: 28, bioStress: 1823, velocity: 12.6 },
    'Goa': { youth: 14.5, migration: 12, bioStress: 456, velocity: 8.9 },
    'Tripura': { youth: 20.1, migration: 19, bioStress: 523, velocity: 8.7 },
    'Mizoram': { youth: 24.3, migration: 16, bioStress: 345, velocity: 7.9 },
    'Arunachal Pradesh': { youth: 23.6, migration: 12, bioStress: 289, velocity: 9.2 }
};

let currentFilter = 'youth'; // Default filter

document.addEventListener('DOMContentLoaded', function () {
    initIndiaMap();
    initializeCharts();
    initScrollAnimations();
    initFilters();
});

// ========================================
// INTERACTIVE INDIA MAP with GeoJSON
// ========================================

function initIndiaMap() {
    const width = document.getElementById('india-map').clientWidth;
    const height = 600;

    const svg = d3.select('#india-map')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    window.mapSvg = svg; // Save for filter updates
    window.mapG = svg.append('g');

    // Load India GeoJSON
    d3.json('india-states.json').then(function (india) {
        window.indiaGeoJSON = india; // Save for filter updates
        const projection = d3.geoMercator()
            .fitSize([width, height], india);

        window.mapProjection = projection;
        const path = d3.geoPath().projection(projection);

        // Draw states
        window.mapG.selectAll('path')
            .data(india.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', d => getColorForState(d.properties.ST_NM, currentFilter))
            .attr('stroke', '#0f172a')
            .attr('stroke-width', 1.5)
            .attr('class', 'state-path')
            .style('cursor', 'pointer')
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 3)
                    .style('filter', 'brightness(1.3)');

                updateMapStats(d.properties.ST_NM);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('stroke', '#0f172a')
                    .attr('stroke-width', 1.5)
                    .style('filter', 'brightness(1)');

                updateMapStats('India');
            })
            .on('click', function (event, d) {
                showStateDetails(d.properties.ST_NM);
            });

        // Add zoom
        const zoom = d3.zoom()
            .scaleExtent([1, 5])
            .on('zoom', (event) => {
                window.mapG.attr('transform', event.transform);
            });

        svg.call(zoom);
    });
}

function getColorForState(stateName, filter) {
    const data = stateData[stateName];
    if (!data) return '#00d4ff'; // Default bright cyan

    let value, colorScale;

    switch (filter) {
        case 'youth':
            value = data.youth;
            colorScale = d3.scaleThreshold()
                .domain([15, 25, 40, 55])
                .range(['#00d4ff', '#0099ff', '#0055ff', '#7700ff', '#ff00ff']);
            break;
        case 'migration':
            value = data.migration;
            colorScale = d3.scaleThreshold()
                .domain([200, 400, 700, 1200])
                .range(['#00ff88', '#00ff00', '#ffff00', '#ff8800', '#ff0000']);
            break;
        case 'biometric':
            value = data.bioStress;
            colorScale = d3.scaleThreshold()
                .domain([300, 600, 1000, 2000])
                .range(['#00ffff', '#00ff88', '#ffff00', '#ff6600', '#ff0000']);
            break;
        case 'velocity':
            value = data.velocity;
            colorScale = d3.scaleThreshold()
                .domain([9, 12, 15, 18])
                .range(['#00d4ff', '#0099ff', '#7700ff', '#ff0099', '#ff00ff']);
            break;
        default:
            value = data.youth;
            colorScale = d3.scaleThreshold()
                .domain([15, 25, 40, 55])
                .range(['#00d4ff', '#0099ff', '#0055ff', '#7700ff', '#ff00ff']);
    }

    return colorScale(value);
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update filter and re-color map
            currentFilter = this.dataset.filter;
            updateMapColors();
        });
    });
}

function updateMapColors() {
    window.mapG.selectAll('.state-path')
        .transition()
        .duration(500)
        .attr('fill', d => getColorForState(d.properties.ST_NM, currentFilter));
    
    // Update stats to reflect the new filter
    updateMapStats('India');
}

function updateMapStats(stateName) {
    const data = stateData[stateName] || { youth: 24.4, migration: 450, bioStress: 600, velocity: 12.5 };

    let youth = data.youth;
    let priority = 'Standard';
    if (youth > 50) priority = 'Critical';
    else if (youth > 35) priority = 'High';
    else if (youth > 25) priority = 'Medium';

    document.getElementById('selected-state').textContent = stateName;
    
    // Update metric value and label based on current filter
    let metricValue, metricLabel;
    
    switch(currentFilter) {
        case 'youth':
            metricValue = youth.toFixed(1) + '%';
            metricLabel = 'Youth %';
            break;
        case 'migration':
            metricValue = data.migration.toLocaleString();
            metricLabel = 'Migration Index';
            break;
        case 'biometric':
            metricValue = data.bioStress.toLocaleString();
            metricLabel = 'Biometric Stress';
            break;
        case 'velocity':
            metricValue = data.velocity.toFixed(1);
            metricLabel = 'Enrollment Velocity';
            break;
        default:
            metricValue = youth.toFixed(1) + '%';
            metricLabel = 'Youth %';
    }
    
    document.getElementById('metric-value').textContent = metricValue;
    document.getElementById('metric-label').textContent = metricLabel;
    document.getElementById('priority-level').textContent = priority;

    // Animate stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.style.animation = 'none';
        setTimeout(() => card.style.animation = 'fadeInUp 0.5s ease-out', 10);
    });
}

function showStateDetails(stateName) {
    const data = stateData[stateName];
    if (data) {
        alert(`${stateName}\n\nYouth Concentration: ${data.youth}%\nMigration Index: ${data.migration}\nBiometric Stress: ${data.bioStress}\nEnrollment Velocity: ${data.velocity}\n\nDetailed analysis available at:\nhttps://www.kaggle.com/code/anshpatidar/uidai-2026-analysis`);
    } else {
        alert(`${stateName}\n\nDetailed analysis available at:\nhttps://www.kaggle.com/code/anshpatidar/uidai-2026-analysis`);
    }
}

// ========================================
// CHART.JS VISUALIZATIONS
// ========================================

function initializeCharts() {
    createSeasonalChart();
    createYouthChart();
    createMigrationChart();
    createStressChart();
    createAgeDistributionChart();
    createBiometricSuccessChart();
    createVelocityComparisonChart();
}

function createSeasonalChart() {
    const ctx = document.getElementById('seasonalChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [{
                label: 'Enrollments (thousands)',
                data: [482, 501, 539, 456, 424, 489, 612, 683, 732],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    padding: 12,
                    titleColor: '#667eea',
                    bodyColor: '#cbd5e1'
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8', callback: v => v + 'K' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

function createYouthChart() {
    const ctx = document.getElementById('youthChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['UP', 'Bihar', 'MP', 'Rajasthan', 'West Bengal', 'Maharashtra', 'Gujarat', 'Assam', 'Jharkhand', 'Meghalaya'],
            datasets: [{
                label: 'Youth Enrollment (Thousands)',
                data: [479, 335, 116, 113, 91, 82, 71, 66, 57, 53],
                backgroundColor: ['#a855f7', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#7c3aed', '#6366f1', '#5b21b6', '#7c3aed', '#6d28d9'],
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    padding: 12,
                    titleColor: '#a855f7',
                    bodyColor: '#cbd5e1',
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + 'K youth enrollments';
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8', callback: v => v + 'K' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

function createMigrationChart() {
    const ctx = document.getElementById('migrationChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['UP', 'Maharashtra', 'Bihar', 'Tamil Nadu', 'Andhra Pradesh', 'Gujarat', 'West Bengal', 'Rajasthan', 'Assam', 'MP'],
            datasets: [{
                label: 'Youth Enrollment (Thousands)',
                data: [479, 82, 335, 87, 92, 71, 91, 113, 66, 116],
                backgroundColor: '#10b981',
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    padding: 12,
                    titleColor: '#10b981',
                    bodyColor: '#cbd5e1',
                    callbacks: {
                        label: function(context) {
                            return context.parsed.x + 'K enrollments';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

function createStressChart() {
    const ctx = document.getElementById('stressChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['UP', 'Maharashtra', 'MP', 'Bihar', 'Tamil Nadu', 'Rajasthan', 'Andhra Pradesh', 'Gujarat', 'Chhattisgarh', 'Karnataka'],
            datasets: [{
                label: 'Biometric Load (Millions)',
                data: [9.577, 9.226, 5.923, 4.897, 4.698, 3.994, 3.714, 3.196, 2.648, 2.635],
                backgroundColor: '#ef4444',
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    padding: 12,
                    titleColor: '#ef4444',
                    bodyColor: '#cbd5e1',
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toFixed(2) + 'M transactions';
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out both';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.insight-card, .timeline-item, .chart-card, .policy-category').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// ADDITIONAL VISUALIZATION CHARTS
// ========================================

function createAgeDistributionChart() {
    const ctx = document.getElementById('ageDistributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Age 0-5 (65.3%)', 'Age 5-17 (31.7%)', 'Age 18+ (3.1%)'],
            datasets: [{
                data: [65.3, 31.7, 3.1],
                backgroundColor: ['#667eea', '#a855f7', '#f59e0b'],
                borderColor: '#1e293b',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    padding: 12,
                    titleColor: '#a855f7',
                    bodyColor: '#cbd5e1',
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function createBiometricSuccessChart() {
    const ctx = document.getElementById('biometricSuccessChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['UP', 'Maharashtra', 'MP', 'Bihar', 'Tamil Nadu', 'Rajasthan', 'Andhra Pradesh', 'Gujarat'],
            datasets: [
                {
                    label: 'Biometric Load (M)',
                    data: [9.577, 9.226, 5.923, 4.897, 4.698, 3.994, 3.714, 3.196],
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderRadius: 8,
                    yAxisID: 'y'
                },
                {
                    label: 'Success Rate Target (%)',
                    data: [88, 88, 88, 88, 88, 88, 88, 88],
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderRadius: 8,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#94a3b8',
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    padding: 12,
                    titleColor: '#10b981',
                    bodyColor: '#cbd5e1'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' },
                    title: {
                        display: true,
                        text: 'Biometric Load (Millions)',
                        color: '#94a3b8'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { display: false },
                    ticks: { color: '#94a3b8', callback: v => v + '%' },
                    title: {
                        display: true,
                        text: 'Success Rate (%)',
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

function createVelocityComparisonChart() {
    const ctx = document.getElementById('velocityComparisonChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['UP', 'Maharashtra', 'Rajasthan', 'MP', 'Bihar', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Assam', 'West Bengal'],
            datasets: [{
                label: 'Enrollment Velocity (K/month)',
                data: [19.2, 18.7, 15.1, 16.4, 18.9, 15.8, 14.9, 17.2, 14.6, 14.3],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.25)',
                borderWidth: 2,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#94a3b8',
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    padding: 12,
                    titleColor: '#667eea',
                    bodyColor: '#cbd5e1',
                    callbacks: {
                        label: function(context) {
                            return 'Velocity: ' + context.parsed.r.toFixed(1) + 'K/month';
                        }
                    }
                }
            },
            scales: {
                r: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8', beginAtZero: true, max: 20 },
                    pointLabels: { color: '#cbd5e1', font: { size: 11 } }
                }
            }
        }
    });
}

// Smooth scroll for nav links
document.querySelectorAll('.floating-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
