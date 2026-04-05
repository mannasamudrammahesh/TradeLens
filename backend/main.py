"""FastAPI backend for Stock Data Intelligence Dashboard."""
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import numpy as np

from database import get_db, init_db, Company, StockData
from models import (
    CompanyResponse, StockDataResponse, SummaryResponse, CompareResponse
)
from data_generator import populate_database, calculate_intelligence_score

app = FastAPI(
    title="Stock Data Intelligence API",
    description="REST API for financial data platform with stock market insights",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    """Initialize database on startup."""
    init_db()
    db = next(get_db())
    
    # Check if database is empty
    company_count = db.query(Company).count()
    if company_count == 0:
        print("📊 Populating database with stock data...")
        populate_database(db)
    else:
        print(f"✅ Database already contains {company_count} companies")


@app.get("/", tags=["Root"])
def read_root():
    """Root endpoint with API information."""
    return {
        "message": "Stock Data Intelligence API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "companies": "/companies",
            "stock_data": "/data/{symbol}",
            "summary": "/summary/{symbol}",
            "compare": "/compare?symbol1=X&symbol2=Y"
        }
    }


@app.get("/companies", response_model=List[CompanyResponse], tags=["Companies"])
def get_companies(db: Session = Depends(get_db)):
    """
    Get list of all available companies with current prices and metrics.
    
    Returns:
        List of companies with current price, change, and intelligence score
    """
    companies = db.query(Company).all()
    result = []
    
    for company in companies:
        # Get all stock data for this company
        stock_data = db.query(StockData).filter(
            StockData.symbol == company.symbol
        ).order_by(StockData.date).all()
        
        if not stock_data:
            continue
        
        latest = stock_data[-1]
        previous = stock_data[-2] if len(stock_data) > 1 else latest
        
        change = latest.close - previous.close
        change_percent = (change / previous.close) * 100
        
        # Calculate metrics
        closes = [s.close for s in stock_data]
        intelligence_score = calculate_intelligence_score(stock_data)
        
        result.append(CompanyResponse(
            symbol=company.symbol,
            name=company.name,
            sector=company.sector,
            price=latest.close,
            change=round(change, 2),
            changePercent=round(change_percent, 2),
            intelligenceScore=intelligence_score,
            high52w=round(max(closes), 2),
            low52w=round(min(closes), 2),
            avgClose=round(sum(closes) / len(closes), 2)
        ))
    
    return result


@app.get("/data/{symbol}", response_model=List[StockDataResponse], tags=["Stock Data"])
def get_stock_data(
    symbol: str,
    days: int = Query(30, ge=1, le=365, description="Number of days of historical data"),
    db: Session = Depends(get_db)
):
    """
    Get historical stock data for a specific symbol.
    
    Args:
        symbol: Stock symbol (e.g., RELIANCE.NS)
        days: Number of days of historical data (default: 30, max: 365)
    
    Returns:
        List of stock data points with OHLC, volume, and technical indicators
    """
    # Verify company exists
    company = db.query(Company).filter(Company.symbol == symbol).first()
    if not company:
        raise HTTPException(status_code=404, detail=f"Company with symbol {symbol} not found")
    
    # Get stock data
    stock_data = db.query(StockData).filter(
        StockData.symbol == symbol
    ).order_by(StockData.date.desc()).limit(days).all()
    
    if not stock_data:
        raise HTTPException(status_code=404, detail=f"No data found for symbol {symbol}")
    
    # Reverse to get chronological order
    stock_data.reverse()
    
    return [
        StockDataResponse(
            date=str(s.date),
            open=s.open,
            high=s.high,
            low=s.low,
            close=s.close,
            volume=s.volume,
            dailyReturn=s.daily_return,
            ma7=s.ma7
        )
        for s in stock_data
    ]


@app.get("/summary/{symbol}", response_model=SummaryResponse, tags=["Summary"])
def get_summary(symbol: str, db: Session = Depends(get_db)):
    """
    Get summary statistics for a stock (52-week high, low, average close).
    
    Args:
        symbol: Stock symbol (e.g., TCS.NS)
    
    Returns:
        Summary with 52-week high, low, average close, and current metrics
    """
    # Verify company exists
    company = db.query(Company).filter(Company.symbol == symbol).first()
    if not company:
        raise HTTPException(status_code=404, detail=f"Company with symbol {symbol} not found")
    
    # Get stock data
    stock_data = db.query(StockData).filter(
        StockData.symbol == symbol
    ).order_by(StockData.date).all()
    
    if not stock_data:
        raise HTTPException(status_code=404, detail=f"No data found for symbol {symbol}")
    
    latest = stock_data[-1]
    previous = stock_data[-2] if len(stock_data) > 1 else latest
    
    closes = [s.close for s in stock_data]
    change = latest.close - previous.close
    change_percent = (change / previous.close) * 100
    
    return SummaryResponse(
        symbol=company.symbol,
        name=company.name,
        sector=company.sector,
        high52w=round(max(closes), 2),
        low52w=round(min(closes), 2),
        avgClose=round(sum(closes) / len(closes), 2),
        currentPrice=latest.close,
        change=round(change, 2),
        changePercent=round(change_percent, 2)
    )


@app.get("/compare", response_model=CompareResponse, tags=["Compare"])
def compare_stocks(
    symbol1: str = Query(..., description="First stock symbol"),
    symbol2: str = Query(..., description="Second stock symbol"),
    db: Session = Depends(get_db)
):
    """
    Compare performance of two stocks.
    
    Args:
        symbol1: First stock symbol (e.g., INFY.NS)
        symbol2: Second stock symbol (e.g., TCS.NS)
    
    Returns:
        Comparison with prices, changes, correlation, and 30-day performance
    """
    # Get both companies
    company1 = db.query(Company).filter(Company.symbol == symbol1).first()
    company2 = db.query(Company).filter(Company.symbol == symbol2).first()
    
    if not company1:
        raise HTTPException(status_code=404, detail=f"Company {symbol1} not found")
    if not company2:
        raise HTTPException(status_code=404, detail=f"Company {symbol2} not found")
    
    # Get stock data for both
    data1 = db.query(StockData).filter(StockData.symbol == symbol1).order_by(StockData.date).all()
    data2 = db.query(StockData).filter(StockData.symbol == symbol2).order_by(StockData.date).all()
    
    if not data1 or not data2:
        raise HTTPException(status_code=404, detail="Insufficient data for comparison")
    
    latest1 = data1[-1]
    latest2 = data2[-1]
    prev1 = data1[-2] if len(data1) > 1 else latest1
    prev2 = data2[-2] if len(data2) > 1 else latest2
    
    change1 = latest1.close - prev1.close
    change2 = latest2.close - prev2.close
    change_percent1 = (change1 / prev1.close) * 100
    change_percent2 = (change2 / prev2.close) * 100
    
    # Calculate 30-day performance
    recent1 = data1[-30:] if len(data1) >= 30 else data1
    recent2 = data2[-30:] if len(data2) >= 30 else data2
    
    perf1 = ((recent1[-1].close - recent1[0].close) / recent1[0].close) * 100
    perf2 = ((recent2[-1].close - recent2[0].close) / recent2[0].close) * 100
    
    # Calculate correlation
    returns1 = [s.daily_return for s in recent1]
    returns2 = [s.daily_return for s in recent2]
    min_len = min(len(returns1), len(returns2))
    
    if min_len > 1:
        correlation = np.corrcoef(returns1[:min_len], returns2[:min_len])[0, 1]
    else:
        correlation = 0.0
    
    return CompareResponse(
        symbol1=symbol1,
        symbol2=symbol2,
        name1=company1.name,
        name2=company2.name,
        price1=latest1.close,
        price2=latest2.close,
        change1=round(change1, 2),
        change2=round(change2, 2),
        changePercent1=round(change_percent1, 2),
        changePercent2=round(change_percent2, 2),
        correlation=round(correlation, 4),
        performance30d1=round(perf1, 2),
        performance30d2=round(perf2, 2)
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
