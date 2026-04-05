# Stock Data Intelligence API

FastAPI backend for the Stock Data Intelligence Dashboard - A financial data platform with REST APIs for stock market analysis.

## Features

- 📊 Historical stock data with OHLC (Open, High, Low, Close)
- 📈 Technical indicators (7-day Moving Average, Daily Returns)
- 🎯 Intelligence scoring system (0-100)
- 🔄 Stock comparison with correlation analysis
- 💾 SQLite database for data persistence
- 📝 Auto-generated Swagger documentation
- 🚀 Fast and async API endpoints

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **Data Processing**: Pandas, NumPy
- **Validation**: Pydantic

## Installation

1. Install Python 3.8+ if not already installed

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the development server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### 1. Get All Companies
```
GET /companies
```
Returns list of all available companies with current prices and metrics.

**Response:**
```json
[
  {
    "symbol": "RELIANCE.NS",
    "name": "Reliance Industries",
    "sector": "Energy",
    "price": 2450.50,
    "change": 12.30,
    "changePercent": 0.50,
    "intelligenceScore": 75,
    "high52w": 2650.00,
    "low52w": 2200.00,
    "avgClose": 2425.00
  }
]
```

### 2. Get Stock Data
```
GET /data/{symbol}?days=30
```
Returns historical stock data for a specific symbol.

**Parameters:**
- `symbol` (path): Stock symbol (e.g., RELIANCE.NS)
- `days` (query): Number of days (default: 30, max: 365)

**Response:**
```json
[
  {
    "date": "2026-03-01",
    "open": 2440.00,
    "high": 2455.00,
    "low": 2435.00,
    "close": 2450.50,
    "volume": 2500000,
    "dailyReturn": 0.43,
    "ma7": 2445.20
  }
]
```

### 3. Get Summary
```
GET /summary/{symbol}
```
Returns 52-week high, low, and average close for a stock.

**Response:**
```json
{
  "symbol": "TCS.NS",
  "name": "Tata Consultancy Services",
  "sector": "IT",
  "high52w": 3850.00,
  "low52w": 3400.00,
  "avgClose": 3625.00,
  "currentPrice": 3680.00,
  "change": 15.50,
  "changePercent": 0.42
}
```

### 4. Compare Stocks
```
GET /compare?symbol1=INFY.NS&symbol2=TCS.NS
```
Compare performance of two stocks.

**Response:**
```json
{
  "symbol1": "INFY.NS",
  "symbol2": "TCS.NS",
  "name1": "Infosys Limited",
  "name2": "Tata Consultancy Services",
  "price1": 1520.00,
  "price2": 3680.00,
  "change1": 8.50,
  "change2": 15.50,
  "changePercent1": 0.56,
  "changePercent2": 0.42,
  "correlation": 0.7234,
  "performance30d1": 3.45,
  "performance30d2": 2.87
}
```

## Database Schema

### Companies Table
- `id`: Primary key
- `symbol`: Stock symbol (unique)
- `name`: Company name
- `sector`: Business sector
- `base_price`: Base price for data generation

### Stock Data Table
- `id`: Primary key
- `symbol`: Stock symbol (foreign key)
- `date`: Trading date
- `open`: Opening price
- `high`: Highest price
- `low`: Lowest price
- `close`: Closing price
- `volume`: Trading volume
- `daily_return`: Daily return percentage
- `ma7`: 7-day moving average

## Intelligence Score Calculation

The Intelligence Score (0-100) is calculated using:
- **Momentum (40%)**: Recent price trend
- **Inverse Volatility (30%)**: Price stability
- **Trend Strength (30%)**: Consistency of positive returns

## Data Generation

The system uses a seeded pseudo-random generator to create realistic stock data:
- 365 days of historical data per company
- Realistic OHLC patterns
- Volume variations
- Technical indicators (MA7, daily returns)

## Testing with Swagger

1. Start the server
2. Open http://localhost:8000/docs
3. Try the endpoints interactively
4. View request/response schemas

## Deployment

### Using Docker (Optional)
```bash
docker build -t stock-api .
docker run -p 8000:8000 stock-api
```

### Deploy to Render/Railway
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── models.py            # Pydantic models
├── database.py          # Database configuration
├── data_generator.py    # Data generation logic
├── requirements.txt     # Python dependencies
├── README.md           # This file
└── stocks.db           # SQLite database (auto-generated)
```

## Author

Created for Jarnox Internship Assignment 2026


## Deploy to Fly.io

### Prerequisites
1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Sign up/login: `fly auth signup` or `fly auth login`

### Deployment Steps

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Launch your app (first time only):**
```bash
fly launch
```
- Choose a unique app name (or let Fly generate one)
- Select region (e.g., `sin` for Singapore, `bom` for Mumbai)
- Don't deploy yet when prompted
- This creates/updates `fly.toml`

3. **Update app name in fly.toml:**
Edit `fly.toml` and replace `your-app-name` with your actual app name from step 2.

4. **Deploy your app:**
```bash
fly deploy
```

5. **Open your deployed app:**
```bash
fly open
```

### Useful Fly.io Commands

```bash
# View logs
fly logs

# Check app status
fly status

# SSH into your app
fly ssh console

# Scale your app
fly scale count 1

# View app info
fly info

# Destroy app (careful!)
fly apps destroy your-app-name
```

### Configuration Notes

- **Auto-scaling**: App automatically stops when idle (free tier optimization)
- **Memory**: 256MB allocated (sufficient for this API)
- **Region**: Set to `sin` (Singapore) - change in `fly.toml` if needed
- **Health checks**: Configured to ping `/` endpoint every 15s
- **Database**: SQLite database persists in the container (resets on redeploy)

### Environment Variables (if needed)

```bash
fly secrets set KEY=value
```

### Troubleshooting

If deployment fails:
1. Check logs: `fly logs`
2. Verify Dockerfile builds locally: `docker build -t test .`
3. Ensure all dependencies are in `requirements.txt`
4. Check app status: `fly status`

### Free Tier Limits
- 3 shared-cpu VMs
- 160GB outbound data transfer/month
- Auto-stop when idle (saves resources)
