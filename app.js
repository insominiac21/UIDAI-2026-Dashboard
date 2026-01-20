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

// Smooth scroll for nav links
document.querySelectorAll('.floating-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
