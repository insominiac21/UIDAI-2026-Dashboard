// Interactive Dashboard with Real India Map and Filters

// Complete state-level data with multiple metrics
const stateData = {
    'Nagaland': { youth: 61.8, migration: 125, bioStress: 234, velocity: 12.3 },
    'Bihar': { youth: 54.5, migration: 790, bioStress: 803, velocity: 18.9 },
    'Manipur': { youth: 52.7, migration: 156, bioStress: 198, velocity: 11.5 },
    'Meghalaya': { youth: 48.9, migration: 142, bioStress: 176, velocity: 10.8 },
    'Arunachal Pradesh': { youth: 47.1, migration: 118, bioStress: 145, velocity: 9.2 },
    'Assam': { youth: 35.2, migration: 287, bioStress: 412, velocity: 14.6 },
    'Tripura': { youth: 33.8, migration: 195, bioStress: 256, velocity: 8.7 },
    'Mizoram': { youth: 32.5, migration: 108, bioStress: 134, velocity: 7.9 },
    'Uttar Pradesh': { youth: 28.9, migration: 839, bioStress: 940, velocity: 19.2 },
    'Madhya Pradesh': { youth: 26.7, migration: 590, bioStress: 1199, velocity: 16.4 },
    'Jharkhand': { youth: 25.8, migration: 412, bioStress: 567, velocity: 13.8 },
    'Rajasthan': { youth: 24.2, migration: 356, bioStress: 1147, velocity: 15.1 },
    'Chhattisgarh': { youth: 23.9, migration: 298, bioStress: 445, velocity: 11.9 },
    'Odisha': { youth: 22.5, migration: 324, bioStress: 489, velocity: 12.6 },
    'West Bengal': { youth: 21.3, migration: 289, bioStress: 534, velocity: 14.3 },
    'Karnataka': { youth: 20.1, migration: 467, bioStress: 678, velocity: 15.8 },
    'Gujarat': { youth: 19.5, migration: 623, bioStress: 789, velocity: 17.2 },
    'Haryana': { youth: 18.9, migration: 445, bioStress: 612, velocity: 13.4 },
    'Punjab': { youth: 17.2, migration: 398, bioStress: 523, velocity: 12.1 },
    'Maharashtra': { youth: 16.8, migration: 1369, bioStress: 2499, velocity: 18.7 },
    'Tamil Nadu': { youth: 15.4, migration: 512, bioStress: 734, velocity: 14.9 },
    'Andhra Pradesh': { youth: 14.9, migration: 1798, bioStress: 892, velocity: 13.2 },
    'Telangana': { youth: 14.2, migration: 589, bioStress: 723, velocity: 12.8 },
    'Kerala': { youth: 12.5, migration: 423, bioStress: 567, velocity: 11.3 },
    'Goa': { youth: 11.8, migration: 234, bioStress: 312, velocity: 8.9 },
    'Himachal Pradesh': { youth: 16.3, migration: 187, bioStress: 245, velocity: 9.4 },
    'Uttarakhand': { youth: 18.7, migration: 276, bioStress: 389, velocity: 10.6 },
    'Jammu and Kashmir': { youth: 22.1, migration: 198, bioStress: 267, velocity: 9.8 },
    'Ladakh': { youth: 19.4, migration: 89, bioStress: 112, velocity: 6.5 }
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
    if (!data) return '#3b82f6'; // Default blue

    let value, colorScale;

    switch (filter) {
        case 'youth':
            value = data.youth;
            colorScale = d3.scaleThreshold()
                .domain([15, 25, 40, 55])
                .range(['#3b82f6', '#667eea', '#8b5cf6', '#a855f7', '#c026d3']);
            break;
        case 'migration':
            value = data.migration;
            colorScale = d3.scaleThreshold()
                .domain([200, 400, 700, 1200])
                .range(['#10b981', '#22c55e', '#f59e0b', '#ef4444', '#dc2626']);
            break;
        case 'biometric':
            value = data.bioStress;
            colorScale = d3.scaleThreshold()
                .domain([300, 600, 1000, 2000])
                .range(['#3b82f6', '#f59e0b', '#ef4444', '#dc2626', '#991b1b']);
            break;
        case 'velocity':
            value = data.velocity;
            colorScale = d3.scaleThreshold()
                .domain([9, 12, 15, 18])
                .range(['#6366f1', '#8b5cf6', '#a855f7', '#c026d3', '#d946ef']);
            break;
        default:
            value = data.youth;
            colorScale = d3.scaleThreshold()
                .domain([15, 25, 40, 55])
                .range(['#3b82f6', '#667eea', '#8b5cf6', '#a855f7', '#c026d3']);
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
                data: [1366, 177, 117, 66, 102, 103, 57, 136, 819],
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
            labels: ['UP', 'Bihar', 'Rajasthan', 'West Bengal', 'MP', 'Maharashtra', 'Gujarat', 'Assam', 'Jharkhand', 'Karnataka'],
            datasets: [{
                label: 'Youth Enrollment (Age 5-17, Thousands)',
                data: [479.7, 334.8, 113.1, 91.4, 116.4, 82.1, 71.2, 66.1, 57.5, 33.9],
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
