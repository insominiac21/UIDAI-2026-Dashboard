# 🎯 Aadhaar Intelligence Dashboard

**Evidence-Based Policy Framework for UIDAI Enrollment Optimization**

An interactive, data-driven dashboard visualizing enrollment patterns, youth concentration, migration flows, and biometric infrastructure stress across India.

## 🌐 Live Demo

**Visit the dashboard:** https://insominiac21.github.io/UIDAI-2026-Dashboard

## ✨ Features

### Interactive Map
- **Real-time filtering** by Youth Concentration, Migration Activity, Biometric Stress, and Enrollment Velocity
- **Hover interactions** showing state-level metrics
- **D3.js powered** zoomable and interactive visualization
- **Color-coded states** representing data intensity

### Data-Driven Policy Framework
- **6 Strategic Categories**:
  - 👥 Youth Enrollment Initiative (2.5M target enrollments)
  - 🚂 Migrant Worker Support (1.8M annual updates)
  - 🔧 Equipment & Infrastructure (7,000 device modernization)
  - ⚡ Resource Optimization (₹15.6 Cr cost savings)
  - 📊 Data & Analytics (Real-time KPI monitoring)
  - 🤝 Community Partnerships (500+ school partnerships)

- **4-Phase Implementation Timeline** (12 months)
- **6 KPI Success Metrics** with ROI targets

### Advanced Visualizations
- 📈 Seasonal Enrollment Patterns (Line Chart)
- 👥 Youth Concentration Leaders (Bar Chart)
- 🚂 Migration Activity Heatmap (Horizontal Bar)
- 🔧 Equipment Stress Analysis (Bar Chart)
- 📊 Age-wise Distribution (Doughnut Chart)
- ✅ Biometric Success Rates (Grouped Bar)
- ⚡ Regional Enrollment Velocity (Radar Chart)

## 📊 Data Sources

- **Biometric Data**: 1.8M+ enrollment records
- **Demographic Data**: 2M+ records
- **Enrollment Data**: 1M+ records with state, district, and pincode granularity
- **Metrics**: Youth %, Migration Index, Biometric Stress, Enrollment Velocity
http://localhost:8000
```

### GitHub Pages Deployment
## 🚀 Getting Started

### Local Development
```bash
# Clone the repository
git clone https://github.com/insominiac21/UIDAI-2026-Dashboard.git
cd UIDAI-2026-Dashboard

# Start a local server (Python 3)
python -m http.server 8000

# OR use Node.js
npx http-server

# Open in browser: http://localhost:8000
```

## 🌐 GitHub Pages Deployment

### ✅ GitHub Pages is Already Enabled!

Your dashboard is automatically deployed to GitHub Pages!

**Live URL**: https://insominiac21.github.io/UIDAI-2026-Dashboard

### How to Verify/Configure GitHub Pages

1. **Go to Repository Settings**
   - Navigate to: https://github.com/insominiac21/UIDAI-2026-Dashboard/settings

2. **Find Pages Section** (Left sidebar → Code and automation → Pages)

3. **Configuration Settings**
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)
   - Click **Save**

4. **Wait for Deployment**
   - Takes 30 seconds to 5 minutes
   - GitHub will show a green checkmark when live
   - Status badge shows deployment status

5. **Visit Your Site**
   - Your dashboard is now live!
   - Share the link: https://insominiac21.github.io/UIDAI-2026-Dashboard

### Custom Domain (Optional)
To use a custom domain (e.g., uidai-dashboard.com):

1. In GitHub Pages settings, add your domain name
2. Update your domain's DNS records:
   ```
   A Record: points to 185.199.108.153
   A Record: points to 185.199.109.153
   A Record: points to 185.199.110.153
   A Record: points to 185.199.111.153
   ```
3. GitHub will automatically provision an SSL certificate

## 📁 File Structure

```
UIDAI-2026-Dashboard/
├── index.html              # Main HTML structure
├── app.js                  # JavaScript logic & visualizations
├── styles.css              # CSS styling & animations
├── india-states.json       # GeoJSON map data
├── README.md               # This file
├── assets/
│   ├── datasets/          # CSV data files (4.8M+ records)
│   │   ├── api_data_aadhar_biometric/
│   │   ├── api_data_aadhar_demographic/
│   │   └── api_data_aadhar_enrolment/
│   ├── UIDAI_EDA.pdf      # Analysis documentation
│   └── *.png              # Screenshot assets
└── .git/                  # Version control
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: D3.js v7, Chart.js
- **Mapping**: GeoJSON-based India state map
- **Styling**: Custom CSS with glassmorphism effects
- **Hosting**: GitHub Pages (Free, CDN-backed)

## 📊 Data & Insights

### Target Outcomes
| Metric | Target | Impact |
|--------|--------|--------|
| Youth Enrollments | 2.5M | Age 5-17 coverage |
| Migrant Updates | 1.8M/year | Transit hub accessibility |
| Biometric Success | 88% | From current 65% |
| Cost Savings | ₹15.6 Cr | Annual savings |
| ROI Improvement | 340% | vs. uniform rollout |

### Key Data Insights
- **Youth Concentration**: Nagaland (61.8%), Bihar (54.5%), Manipur (52.7%)
- **Migration Corridors**: UP → Maharashtra, Bihar → Maharashtra
- **Biometric Stress**: Maharashtra (2,499%), MP (1,199%), Rajasthan (1,147%)
- **Enrollment Velocity**: UP (19.2), Maharashtra (18.7), Bihar (18.9)

## 🎨 Design Features

### Visual Excellence
- ✅ Dark theme with glassmorphism effects
- ✅ Smooth animations and transitions
- ✅ Responsive design (mobile to desktop)
- ✅ Color-coded data intensity
- ✅ Interactive hover states

### Policy Framework
- ✅ 6 strategic categories
- ✅ 12+ data-backed recommendations
- ✅ 4-phase implementation timeline
- ✅ 6 KPI success metrics
- ✅ ROI calculations

## 🔐 Security & Performance

- ✅ No backend required (static files)
- ✅ CDN-delivered via GitHub Pages
- ✅ Fast load times (<2s on broadband)
- ✅ Mobile-responsive
- ✅ No external API dependencies

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Full |
| Firefox | Latest | ✅ Full |
| Safari | Latest | ✅ Full |
| Edge | Latest | ✅ Full |
| Mobile | Modern | ✅ Full |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the UIDAI Hackathon 2026. All visualizations use publicly available UIDAI enrollment data.

## 👤 Author

**Ansh Patidar**
- 📊 [Kaggle Analysis](https://www.kaggle.com/code/anshpatidar/uidai-2026-analysis)
- 🐙 [GitHub](https://github.com/insominiac21)

## 📞 Support

For issues or suggestions:
1. Open an [Issue](https://github.com/insominiac21/UIDAI-2026-Dashboard/issues)
2. Include detailed description with screenshots
3. Provide browser/device information

## 🎯 Future Roadmap

- [ ] Real-time data integration
- [ ] State-wise detail pages
- [ ] District-level drill-down
- [ ] Predictive modeling
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Advanced filters & export
- [ ] User authentication

---

**Status**: ✅ Live & Production Ready  
**Last Updated**: January 20, 2026  
**Dashboard Version**: 2.0
