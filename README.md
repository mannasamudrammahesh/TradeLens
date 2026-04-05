# 🚀 Stock Data Intelligence Dashboard - TradeLens

A comprehensive financial data platform built for the Jarnox Internship Assignment. This project demonstrates full-stack development with real-time stock market data analysis, REST APIs, and intelligent insights.

## 📋 Project Overview

TradeLens is a mini financial data platform that provides:
- Real-time stock market data visualization
- Technical analysis with moving averages and indicators
- AI-powered trend predictions and insights
- Intelligence scoring system (0-100)
- Stock comparison with correlation analysis
- REST API backend with comprehensive documentation

## ✨ Features

### Frontend (React + TypeScript)
- 📊 Interactive dashboard with real-time data
- 📈 Advanced charting with Recharts
- 🎯 Intelligence scoring for each stock
- 🔍 Search and filter functionality
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI with shadcn/ui components
- 💾 CSV export functionality
- 🔄 Automatic backend/mock data fallback

### Backend (Python + FastAPI)
- 🚀 Fast and async REST APIs
- 💾 SQLite database with SQLAlchemy ORM
- 📊 Historical data generation (365 days)
- 📈 Technical indicators calculation
- 🔄 Stock comparison with correlation
- 📝 Auto-generated Swagger documentation
- 🎯 Intelligence scoring algorithm

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts
- React Query

### Backend
- Python 3.11+
- FastAPI
- SQLAlchemy
- Pandas & NumPy
- SQLite
- Pydantic

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/bun
- Python 3.11+
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd stock-intelligence-dashboard
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

The backend will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun run dev
```

The frontend will be available at: http://localhost:5173

## 🔌 API Endpoints

### 1. Get All Companies
```
GET /companies
```
Returns list of all available companies with current prices and metrics.

### 2. Get Stock Data
```
GET /data/{symbol}?days=30
```
Returns historical stock data for a specific symbol.

**Parameters:**
- `symbol` (path): Stock symbol (e.g., RELIANCE.NS)
- `days` (query): Number of days (default: 30, max: 365)

### 3. Get Summary
```
GET /summary/{symbol}
```
Returns 52-week high, low, and average close for a stock.

### 4. Compare Stocks
```
GET /compare?symbol1=INFY.NS&symbol2=TCS.NS
```
Compare performance of two stocks with correlation analysis.

## 📊 Data & Metrics

### Available Stocks
The platform includes **100 top NSE stocks** across various sectors including Banking, IT, Energy, Automobile, FMCG, Pharma, Cement, Consumer Goods, Infrastructure, Retail, and more. Major companies include Reliance, TCS, HDFC Bank, Infosys, ICICI Bank, Hindustan Unilever, ITC, Maruti, Asian Paints, and many others.

### Technical Indicators
- **Daily Return**: (Close - Open) / Open × 100
- **7-Day Moving Average**: Average of last 7 closing prices
- **52-Week High/Low**: Maximum and minimum prices over 365 days
- **Intelligence Score**: Composite score (0-100) based on:
  - Momentum (40%): Recent price trend
  - Inverse Volatility (30%): Price stability
  - Trend Strength (30%): Consistency of positive returns

### Custom Metrics
- **Correlation Analysis**: Pearson correlation between two stocks
- **30-Day Performance**: Percentage change over last 30 days
- **AI Trend Prediction**: 5-day price forecast with confidence level

## 🧪 Testing

### Test Backend APIs
```bash
cd backend
python test_api.py
```

### Test Frontend
```bash
npm run test
# or
bun test
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_URL=<your-backend-url>`

### Docker Deployment
```bash
# Backend
cd backend
docker build -t stock-api .
docker run -p 8000:8000 stock-api

# Frontend
cd ..
docker build -t stock-frontend .
docker run -p 5173:5173 stock-frontend
```

## 📁 Project Structure

```
stock-intelligence-dashboard/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── database.py          # Database configuration
│   ├── data_generator.py    # Data generation logic
│   ├── requirements.txt     # Python dependencies
│   ├── test_api.py          # API test suite
│   ├── Dockerfile           # Docker configuration
│   └── README.md            # Backend documentation
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx    # Main dashboard component
│   │   └── ui/              # shadcn/ui components
│   ├── lib/
│   │   ├── api.ts           # Backend API client
│   │   ├── stockData.ts     # Mock data generator
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   └── Index.tsx        # Home page
│   └── main.tsx             # React entry point
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md                # This file
```

## 🎯 Assignment Completion

### ✅ Completed Requirements

**Part 1 - Data Collection & Preparation**
- ✅ Stock market data generation (365 days)
- ✅ Data cleaning and organization with Pandas
- ✅ Missing value handling
- ✅ Date conversion
- ✅ Calculated metrics (Daily Return, 7-Day MA, 52-Week High/Low)
- ✅ Custom metrics (Intelligence Score, Correlation, Volatility)

**Part 2 - Backend API Development**
- ✅ REST APIs with FastAPI
- ✅ `/companies` endpoint
- ✅ `/data/{symbol}` endpoint
- ✅ `/summary/{symbol}` endpoint
- ✅ `/compare` endpoint (bonus)
- ✅ Swagger documentation

**Part 3 - Visualization Dashboard**
- ✅ Interactive web dashboard
- ✅ Company list with search
- ✅ Dynamic charts (Recharts)
- ✅ Filters (30/90 days)
- ✅ Top Gainers/Losers
- ✅ Key insights display

**Part 4 - Optional Add-ons**
- ✅ AI trend prediction feature
- ✅ Docker configuration
- ✅ Comprehensive documentation
- ✅ CSV export functionality
- ✅ Intelligence scoring system

## 💡 Creative Features

1. **Intelligence Score**: Proprietary algorithm combining momentum, volatility, and trend strength
2. **AI Insights**: 5-day price predictions with confidence levels
3. **Visual Indicators**: Color-coded scores and trend indicators
4. **Automatic Fallback**: Seamless switch between backend API and mock data
5. **Real-time Status**: Backend connection indicator

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development with modern technologies
- RESTful API design and implementation
- Data processing and analysis with Pandas
- Financial metrics calculation
- Database design and ORM usage
- Frontend state management
- Responsive UI/UX design
- API documentation best practices

## 👨‍💻 Author

Created for Jarnox Internship Assignment 2026

## 📝 License

This project is created for educational purposes as part of an internship assignment.

## 🚀 Deployment

### Recommended Free Hosting

**Backend**: [Fly.io](https://fly.io) - Free tier (3 VMs, 160GB bandwidth)  
**Frontend**: [Netlify](https://netlify.com) - Free tier (100GB bandwidth)

### Quick Deploy Steps

#### 1. Deploy Backend to Fly.io

```bash
# Navigate to backend
cd backend

# Install Fly CLI (if not installed)
# Windows: iwr https://fly.io/install.ps1 -useb | iex
# Mac/Linux: curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login

# Launch app (first time)
fly launch
# - Choose app name
# - Select region (sin for Singapore, bom for Mumbai)
# - Don't deploy yet

# Update fly.toml with your app name

# Deploy
fly deploy

# Get your backend URL
fly info
```

Your backend will be at: `https://your-app-name.fly.dev`

#### 2. Deploy Frontend to Netlify

```bash
# Navigate to project root
cd ..

# Create .env.production file
echo "VITE_API_URL=https://your-app-name.fly.dev" > .env.production

# Build the project
npm run build

# Deploy to Netlify (Option 1: Drag & Drop)
# - Go to https://app.netlify.com/drop
# - Drag the 'dist' folder

# Deploy to Netlify (Option 2: CLI)
npm install -g netlify-cli
netlify login
netlify deploy --prod
# - Choose 'dist' as publish directory
```

#### 3. Connect GitHub (Recommended for Auto-Deploy)

**Backend (Fly.io):**
- Push code to GitHub
- Fly.io auto-deploys on push (configure with GitHub Actions)

**Frontend (Netlify):**
- Go to https://app.netlify.com
- New site from Git → Connect GitHub repo
- Build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- Environment variables:
  - `VITE_API_URL`: `https://your-app-name.fly.dev`
- Deploy

### After Deployment

Your app will be live at:
- Frontend: `https://your-site.netlify.app`
- Backend: `https://your-app-name.fly.dev`
- API Docs: `https://your-app-name.fly.dev/docs`

### Configuration Files

- `backend/fly.toml` - Fly.io configuration
- `netlify.toml` - Netlify configuration
- `.env.example` - Environment variables template

**Note**: Fly.io free tier auto-stops when idle (saves resources, wakes instantly on request)
