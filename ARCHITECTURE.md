# 🏗️ TradeLens Architecture

Complete system architecture and data flow documentation.

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        TradeLens                             │
│              Stock Data Intelligence Platform                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                             │
        ▼                                             ▼
┌──────────────┐                              ┌──────────────┐
│   Frontend   │◄────── HTTP/REST ────────────│   Backend    │
│  React + TS  │                              │  FastAPI     │
└──────────────┘                              └──────────────┘
        │                                             │
        │                                             │
        ▼                                             ▼
┌──────────────┐                              ┌──────────────┐
│  Recharts    │                              │   SQLite     │
│  Tailwind    │                              │  Database    │
└──────────────┘                              └──────────────┘
```

---

## 🔄 Data Flow

### 1. Application Startup

```
Backend Startup:
┌─────────────┐
│ main.py     │
└──────┬──────┘
       │
       ├──► Initialize Database (database.py)
       │    └──► Create tables (companies, stock_data)
       │
       ├──► Check if data exists
       │    └──► If empty: populate_database()
       │         └──► Generate 365 days of data
       │              └──► 8 companies × 365 days
       │
       └──► Start Uvicorn server (port 8000)

Frontend Startup:
┌─────────────┐
│ main.tsx    │
└──────┬──────┘
       │
       ├──► Initialize React Query
       ├──► Setup Router
       └──► Render Dashboard
            └──► Check backend health
                 ├──► Success: Fetch from API
                 └──► Fail: Use mock data
```

### 2. User Interaction Flow

```
User Action → Frontend → API Request → Backend → Database → Response

Example: View Stock Chart
┌──────────────────────────────────────────────────────────┐
│ 1. User clicks "TCS" in sidebar                          │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ 2. Dashboard.tsx updates selectedSymbol state            │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ 3. useEffect triggers API call                           │
│    fetchStockData("TCS.NS", 30)                          │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ 4. HTTP GET /data/TCS.NS?days=30                         │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ 5. FastAPI endpoint handler (main.py)                    │
│    - Validate symbol                                     │
│    - Query database                                      │
│    - Format response                                     │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ 6. SQLAlchemy queries stock_data table                   │
│    SELECT * FROM stock_data                              │
│    WHERE symbol = 'TCS.NS'                               │
│    ORDER BY date DESC LIMIT 30                           │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ 7. Return JSON response                                  │
│    [{date, open, high, low, close, volume, ...}, ...]   │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ 8. Frontend receives data                                │
│    setChartData(data)                                    │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ 9. Recharts renders chart                                │
│    - Line chart for prices                               │
│    - Bar chart for volume                                │
│    - Moving average overlay                              │
└──────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Companies Table
```sql
CREATE TABLE companies (
    id INTEGER PRIMARY KEY,
    symbol VARCHAR UNIQUE,
    name VARCHAR,
    sector VARCHAR,
    base_price FLOAT
);
```

### Stock Data Table
```sql
CREATE TABLE stock_data (
    id INTEGER PRIMARY KEY,
    symbol VARCHAR,
    date DATE,
    open FLOAT,
    high FLOAT,
    low FLOAT,
    close FLOAT,
    volume INTEGER,
    daily_return FLOAT,
    ma7 FLOAT,
    FOREIGN KEY (symbol) REFERENCES companies(symbol)
);
```

### Relationships
```
companies (1) ──────── (many) stock_data
   │                           │
   └─ symbol ──────────────────┘
```

---

## 🔧 Component Architecture

### Backend Components

```
backend/
├── main.py                 # FastAPI application
│   ├── @app.on_event("startup")
│   ├── @app.get("/")
│   ├── @app.get("/companies")
│   ├── @app.get("/data/{symbol}")
│   ├── @app.get("/summary/{symbol}")
│   └── @app.get("/compare")
│
├── models.py              # Pydantic models
│   ├── CompanyResponse
│   ├── StockDataResponse
│   ├── SummaryResponse
│   └── CompareResponse
│
├── database.py            # Database layer
│   ├── Company (SQLAlchemy model)
│   ├── StockData (SQLAlchemy model)
│   ├── get_db() (dependency)
│   └── init_db()
│
└── data_generator.py      # Data generation
    ├── generate_stock_history()
    ├── populate_database()
    └── calculate_intelligence_score()
```

### Frontend Components

```
src/
├── main.tsx               # Entry point
│   └── App.tsx
│       └── Index.tsx
│           └── Dashboard.tsx
│
├── components/
│   ├── Dashboard.tsx      # Main component
│   │   ├── State management
│   │   ├── API integration
│   │   ├── Chart rendering
│   │   └── UI components
│   │
│   └── ui/               # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
│
└── lib/
    ├── api.ts            # Backend API client
    │   ├── fetchCompanies()
    │   ├── fetchStockData()
    │   ├── fetchSummary()
    │   └── fetchCompare()
    │
    ├── stockData.ts      # Mock data fallback
    │   ├── getCompanies()
    │   ├── getStockData()
    │   └── getAIInsight()
    │
    └── utils.ts          # Utility functions
```

---

## 🔄 API Request/Response Flow

### GET /companies

```
Request:
GET http://localhost:8000/companies

Processing:
1. Query all companies from database
2. For each company:
   - Get all stock data
   - Calculate latest price
   - Calculate change
   - Calculate intelligence score
   - Calculate 52-week high/low
3. Format as CompanyResponse[]

Response:
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
  },
  ...
]
```

### GET /data/{symbol}

```
Request:
GET http://localhost:8000/data/TCS.NS?days=30

Processing:
1. Validate symbol exists
2. Query stock_data table
   - Filter by symbol
   - Order by date DESC
   - Limit to 'days' parameter
3. Reverse to chronological order
4. Format as StockDataResponse[]

Response:
[
  {
    "date": "2026-03-01",
    "open": 3670.00,
    "high": 3690.00,
    "low": 3665.00,
    "close": 3680.00,
    "volume": 2500000,
    "dailyReturn": 0.27,
    "ma7": 3675.50
  },
  ...
]
```

---

## 🧮 Intelligence Score Algorithm

```
Intelligence Score = (Momentum × 0.4) + (Inverse Volatility × 0.3) + (Trend Strength × 0.3)

Where:
┌─────────────────────────────────────────────────────────┐
│ Momentum (40%)                                          │
│ - Recent 30-day price change                            │
│ - Formula: ((latest - first) / first) × 100            │
│ - Score: 50 + (momentum × 5)                           │
│ - Range: 0-100                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Inverse Volatility (30%)                                │
│ - Standard deviation of daily returns                   │
│ - Lower volatility = higher score                       │
│ - Formula: 100 - (std_dev × 30)                        │
│ - Range: 0-100                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Trend Strength (30%)                                    │
│ - Percentage of positive return days                    │
│ - Formula: (positive_days / total_days) × 100          │
│ - Range: 0-100                                          │
└─────────────────────────────────────────────────────────┘

Final Score: Weighted average, rounded to integer
```

---

## 🎨 Frontend State Management

```
Dashboard Component State:
┌─────────────────────────────────────────────────────────┐
│ companies: Company[]        # All companies             │
│ selectedSymbol: string      # Currently selected stock  │
│ search: string              # Search filter             │
│ days: 30 | 90              # Time period                │
│ backendAvailable: boolean   # Backend connection status │
│ loading: boolean            # Loading state             │
│ chartData: StockEntry[]     # Chart data               │
└─────────────────────────────────────────────────────────┘

State Updates:
┌─────────────────────────────────────────────────────────┐
│ useEffect(() => {                                       │
│   loadData()  // On mount                               │
│ }, [])                                                  │
│                                                         │
│ useEffect(() => {                                       │
│   loadChartData()  // When symbol or days change       │
│ }, [selectedSymbol, days, backendAvailable])           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Error Handling

### Backend Error Handling
```
┌─────────────────────────────────────────────────────────┐
│ 404 Not Found                                           │
│ - Invalid stock symbol                                  │
│ - No data available                                     │
│                                                         │
│ 422 Validation Error                                   │
│ - Invalid query parameters                             │
│ - Type mismatch                                         │
│                                                         │
│ 500 Internal Server Error                              │
│ - Database errors                                       │
│ - Unexpected exceptions                                 │
└─────────────────────────────────────────────────────────┘
```

### Frontend Error Handling
```
┌─────────────────────────────────────────────────────────┐
│ Backend Unavailable                                     │
│ → Automatic fallback to mock data                       │
│ → Orange WiFi icon displayed                            │
│                                                         │
│ API Request Failed                                      │
│ → Try mock data                                         │
│ → Log error to console                                  │
│                                                         │
│ No Data Available                                       │
│ → Display empty state                                   │
│ → Show helpful message                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Performance Optimizations

### Backend
- **Database Indexing**: Symbol and date columns indexed
- **Query Optimization**: Limit results, use efficient queries
- **Caching**: Data pre-generated on startup
- **Async Operations**: FastAPI async support

### Frontend
- **React.memo**: Memoized components
- **useMemo**: Expensive calculations cached
- **useEffect**: Controlled re-renders
- **Code Splitting**: Lazy loading (if needed)

---

## 🔄 Deployment Architecture

```
Production Setup:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  User Browser                                           │
│       │                                                 │
│       ├──► Frontend (Vercel/Netlify)                   │
│       │    - Static React build                         │
│       │    - CDN distribution                           │
│       │    - HTTPS enabled                              │
│       │                                                 │
│       └──► Backend (Render/Railway)                     │
│            - FastAPI server                             │
│            - SQLite database                            │
│            - HTTPS enabled                              │
│            - Auto-scaling                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Data Generation Process

```
Seeded Random Generator:
┌─────────────────────────────────────────────────────────┐
│ Input: base_price, seed, days                           │
│                                                         │
│ For each trading day:                                   │
│   1. Calculate random price change                      │
│   2. Generate OHLC values                               │
│      - Open = previous close                            │
│      - Close = open + change                            │
│      - High = max(open, close) + random                 │
│      - Low = min(open, close) - random                  │
│   3. Generate volume (500K - 5.5M)                      │
│   4. Calculate daily return                             │
│                                                         │
│ Calculate 7-day MA:                                     │
│   - For each point: average of last 7 closes           │
│                                                         │
│ Output: 365 days of realistic stock data               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Design Decisions

### Why SQLite?
- ✅ No setup required
- ✅ File-based, portable
- ✅ Sufficient for demo
- ✅ Easy to reset

### Why FastAPI?
- ✅ Modern, fast
- ✅ Auto-generated docs
- ✅ Type safety with Pydantic
- ✅ Async support

### Why React + TypeScript?
- ✅ Type safety
- ✅ Component reusability
- ✅ Large ecosystem
- ✅ Industry standard

### Why Mock Data Fallback?
- ✅ Works without backend
- ✅ Demo-friendly
- ✅ Development flexibility
- ✅ Resilient architecture

---

## 📈 Scalability Considerations

### Current Limitations
- SQLite (single-file database)
- In-memory calculations
- No caching layer
- Single server

### Future Improvements
- PostgreSQL for production
- Redis for caching
- Load balancing
- Microservices architecture
- Real-time WebSocket updates

---

## 🔒 Security Considerations

### Current Implementation
- CORS enabled for development
- Input validation with Pydantic
- SQL injection prevention (ORM)
- No authentication (demo)

### Production Requirements
- JWT authentication
- Rate limiting
- HTTPS only
- API key management
- Input sanitization

---

**This architecture supports the complete TradeLens platform!** 🏗️
