# Aadhaar Intelligence Dashboard

**Live Demo:** [Deploy on GitHub Pages]

## 📊 Overview

An interactive policy intelligence dashboard analyzing **5.4M Aadhaar enrollment records** across 1,045 districts in India. This dashboard transforms raw data into actionable policy insights with beautiful visualizations and an interactive India map.

## ✨ Features

### Interactive India Map
- **Real GeoJSON Map**: Accurate state boundaries with smooth interactions
- **Multiple Metric Filters**:
  - 👥 Youth Concentration (%)
  - 🚂 Migration Activity (update intensity)
  - 🔧 Biometric Stress (equipment quality)
  - ⚡ Enrollment Velocity (growth rate)
- **Hover Tooltips**: State-specific statistics
- **Zoom & Pan**: Explore regions in detail
- **Click for Details**: Links to comprehensive analysis

### Policy Insights
- **4 Key Discoveries**: Youth opportunity, seasonal patterns, migration corridors, equipment crisis
- **Root Cause Analysis**: Two-city migration perspective (source vs. destination needs)
- **Development Policies**: Source city job creation, destination city infrastructure
- **UIDAI Operations**: Transit hubs, equipment refresh, seasonal staffing

### Data Visualizations
- **Seasonal Enrollment Pattern**: 73% surge during school resumption
- **Youth Concentration Leaders**: Northeast states at 2.5× national average
- **Migration Heatmap**: UP/Bihar → Maharashtra corridors
- **Equipment Stress Analysis**: Age-stress correlation (r=0.76)

## 🚀 Quick Start

### Local Development
```bash
# Clone or download the dashboard-deploy folder
cd dashboard-deploy

# Start a local server (Python)
python -m http.server 8000

# OR use Node.js
npx http-server -p 8000

# OR use PHP
php -S localhost:8000

# Open in browser
http://localhost:8000
```

### GitHub Pages Deployment
1. Create a new GitHub repository
2. Upload all files from `dashboard-deploy`:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `india-states.json`
3. Enable GitHub Pages in repository Settings → Pages
4. Select `main` branch, root folder
5. Your dashboard will be live at `https://yourusername.github.io/repo-name`

## 📁 File Structure

```
dashboard-deploy/
├── index.html           # Main dashboard structure
├── app.js               # Interactive map logic & filters
├── styles.css           # Beautiful dark theme styling
├── india-states.json    # GeoJSON map data
└── README.md            # This file
```

## 🛠️ Technologies

- **D3.js v7**: Interactive India map with GeoJSON rendering
- **Chart.js 4.x**: Beautiful, responsive charts
- **Vanilla JS (ES6+)**: No framework dependencies
- **CSS3**: Dark theme with glassmorphism effects
- **HTML5**: Semantic, accessible structure

## 📊 Data Sources

- **Primary Data**: 5.4M Aadhaar enrollment records (Jan-Sep 2025)
- **Geographic Coverage**: 1,045 districts, 28 states + 8 UTs
- **Analysis**: Kaggle Notebook - [View Complete Analysis](https://www.kaggle.com/code/anshpatidar/uidai-2026-analysis)

## 🎨 Key Metrics

### All 29 Indian States Included
Complete data for:
- **Northeast**: Nagaland (61.8% youth), Bihar (54.5%), Manipur (52.7%)
- **Major States**: UP (28.9%), Maharashtra (16.8%), Karnataka (20.1%)
- **Migration Hubs**: UP (839% update ratio), Maharashtra (1369%)
- **Equipment Stress**: Maharashtra (2499%), MP (1199%), Rajasthan (1147%)

### Filter Views
- **Youth Concentration**: Blue → Purple gradient (12%-62%)
- **Migration Activity**: Green → Red gradient (89-1798 ratio)
- **Biometric Stress**: Blue → Dark Red gradient (112-2499)
- **Enrollment Velocity**: Purple gradient (6.5-19.2 K/month)

## 🌟 Design Philosophy

### Visual Excellence
- **Dark Theme**: Professional, modern aesthetic
- **Gradient Accents**: Purple-blue primary palette
- **Glassmorphism**: Subtle depth and hierarchy
- **Smooth Animations**: Fade-in effects, hover states
- **Responsive Design**: Mobile, tablet, desktop optimized

### Policy-First Approach
- **Narrative Over Numbers**: Every chart tells a story
- **Root Causes**: Explain WHY, not just WHAT
- **Actionable**: Specific investments, timelines, impacts
- **Differentiated**: Development policies vs. operational improvements

## 💡 Usage Examples

### Exploring Youth Opportunities
1. Click **"Youth Concentration"** filter
2. Hover over Northeast states (dark purple)
3. See Nagaland: 61.8%, Bihar: 54.5%
4. Read insight card for school partnership strategy

### Understanding Migration
1. Click **"Migration Activity"** filter
2. Hover over UP (source, dark red) and Maharashtra (destination, dark red)
3. Read migration insight card for two-city policy approach
4. View source development vs. destination infrastructure needs

### Assessing Equipment Quality
1. Click **"Biometric Stress"** filter
2. Hover over Maharashtra (darkest red, 2499% stress)
3. See correlation with 7.8-year average equipment age
4. Review equipment refresh ROI (Rs. 4,156 Cr annual savings)

## 📈 Impact Summary

- ✅ **2.5M** potential youth enrollments via school programs
- ✅ **Rs. 4,187 Cr** annual cost savings through equipment refresh
- ✅ **73%** seasonal variation identified for staffing optimization
- ✅ **1.8M** migrant workers served through transit hubs
- ✅ **7.3x ROI** portfolio return over 5 years

## 🔗 Additional Resources

- **Comprehensive Report**: LaTeX-formatted policy analysis
- **Kaggle Notebook**: [Reproducible analysis with Python](https://www.kaggle.com/code/anshpatidar/uidai-2026-analysis)
- **UIDAI Hackathon 2026**: Submission package

## 👤 Author

**Ansh Patidar**  
UIDAI Hackathon 2026  
January 2026

---

## 🐛 Troubleshooting

### Map Not Loading
- Ensure `india-states.json` is in the same directory as `index.html`
- Check browser console for errors (F12)
- Verify you're running a local server (not opening index.html directly)

### Filters Not Working
- Check that `app.js` loaded correctly (view browser console)
- Ensure JavaScript is enabled
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Charts Not Rendering
- Verify Chart.js CDN is accessible
- Check internet connection
- Try clearing browser cache

---

**Built with ❤️ for evidence-based policymaking**
