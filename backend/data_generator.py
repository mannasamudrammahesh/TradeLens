"""Generate and populate stock data."""
import random
from datetime import datetime, timedelta
from typing import List, Tuple
from sqlalchemy.orm import Session
from database import Company, StockData


COMPANIES_BASE = [
    # Top 100 NSE Stocks by Market Cap
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "sector": "Energy", "base_price": 2450},
    {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "sector": "IT", "base_price": 3680},
    {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "sector": "Banking", "base_price": 1680},
    {"symbol": "INFY.NS", "name": "Infosys", "sector": "IT", "base_price": 1520},
    {"symbol": "ICICIBANK.NS", "name": "ICICI Bank", "sector": "Banking", "base_price": 1150},
    {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever", "sector": "FMCG", "base_price": 2580},
    {"symbol": "ITC.NS", "name": "ITC Limited", "sector": "FMCG", "base_price": 445},
    {"symbol": "SBIN.NS", "name": "State Bank of India", "sector": "Banking", "base_price": 780},
    {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel", "sector": "Telecom", "base_price": 1620},
    {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "sector": "Banking", "base_price": 1850},
    {"symbol": "LT.NS", "name": "Larsen & Toubro", "sector": "Infrastructure", "base_price": 3380},
    {"symbol": "HCLTECH.NS", "name": "HCL Technologies", "sector": "IT", "base_price": 1480},
    {"symbol": "AXISBANK.NS", "name": "Axis Bank", "sector": "Banking", "base_price": 1120},
    {"symbol": "ASIANPAINT.NS", "name": "Asian Paints", "sector": "Consumer Goods", "base_price": 2950},
    {"symbol": "MARUTI.NS", "name": "Maruti Suzuki", "sector": "Automobile", "base_price": 11500},
    {"symbol": "SUNPHARMA.NS", "name": "Sun Pharmaceutical", "sector": "Pharma", "base_price": 1680},
    {"symbol": "TITAN.NS", "name": "Titan Company", "sector": "Consumer Goods", "base_price": 3420},
    {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance", "sector": "Finance", "base_price": 7250},
    {"symbol": "WIPRO.NS", "name": "Wipro", "sector": "IT", "base_price": 445},
    {"symbol": "ULTRACEMCO.NS", "name": "UltraTech Cement", "sector": "Cement", "base_price": 9850},
    {"symbol": "NESTLEIND.NS", "name": "Nestle India", "sector": "FMCG", "base_price": 24500},
    {"symbol": "ONGC.NS", "name": "Oil & Natural Gas Corp", "sector": "Energy", "base_price": 245},
    {"symbol": "TATAMOTORS.NS", "name": "Tata Motors", "sector": "Automobile", "base_price": 920},
    {"symbol": "NTPC.NS", "name": "NTPC Limited", "sector": "Power", "base_price": 355},
    {"symbol": "POWERGRID.NS", "name": "Power Grid Corp", "sector": "Power", "base_price": 285},
    {"symbol": "TECHM.NS", "name": "Tech Mahindra", "sector": "IT", "base_price": 1650},
    {"symbol": "M&M.NS", "name": "Mahindra & Mahindra", "sector": "Automobile", "base_price": 2850},
    {"symbol": "BAJAJFINSV.NS", "name": "Bajaj Finserv", "sector": "Finance", "base_price": 1680},
    {"symbol": "ADANIPORTS.NS", "name": "Adani Ports", "sector": "Infrastructure", "base_price": 1280},
    {"symbol": "COALINDIA.NS", "name": "Coal India", "sector": "Mining", "base_price": 425},
    {"symbol": "TATASTEEL.NS", "name": "Tata Steel", "sector": "Steel", "base_price": 145},
    {"symbol": "JSWSTEEL.NS", "name": "JSW Steel", "sector": "Steel", "base_price": 920},
    {"symbol": "HINDALCO.NS", "name": "Hindalco Industries", "sector": "Metals", "base_price": 645},
    {"symbol": "INDUSINDBK.NS", "name": "IndusInd Bank", "sector": "Banking", "base_price": 1450},
    {"symbol": "DIVISLAB.NS", "name": "Divi's Laboratories", "sector": "Pharma", "base_price": 3850},
    {"symbol": "DRREDDY.NS", "name": "Dr. Reddy's Labs", "sector": "Pharma", "base_price": 6250},
    {"symbol": "CIPLA.NS", "name": "Cipla", "sector": "Pharma", "base_price": 1450},
    {"symbol": "EICHERMOT.NS", "name": "Eicher Motors", "sector": "Automobile", "base_price": 4850},
    {"symbol": "GRASIM.NS", "name": "Grasim Industries", "sector": "Cement", "base_price": 2450},
    {"symbol": "HEROMOTOCO.NS", "name": "Hero MotoCorp", "sector": "Automobile", "base_price": 4650},
    {"symbol": "BRITANNIA.NS", "name": "Britannia Industries", "sector": "FMCG", "base_price": 5250},
    {"symbol": "BPCL.NS", "name": "Bharat Petroleum", "sector": "Energy", "base_price": 585},
    {"symbol": "SHREECEM.NS", "name": "Shree Cement", "sector": "Cement", "base_price": 27500},
    {"symbol": "APOLLOHOSP.NS", "name": "Apollo Hospitals", "sector": "Healthcare", "base_price": 6450},
    {"symbol": "ADANIENT.NS", "name": "Adani Enterprises", "sector": "Conglomerate", "base_price": 2850},
    {"symbol": "TATACONSUM.NS", "name": "Tata Consumer Products", "sector": "FMCG", "base_price": 1120},
    {"symbol": "SBILIFE.NS", "name": "SBI Life Insurance", "sector": "Insurance", "base_price": 1580},
    {"symbol": "HDFCLIFE.NS", "name": "HDFC Life Insurance", "sector": "Insurance", "base_price": 685},
    {"symbol": "BAJAJ-AUTO.NS", "name": "Bajaj Auto", "sector": "Automobile", "base_price": 9250},
    {"symbol": "VEDL.NS", "name": "Vedanta Limited", "sector": "Mining", "base_price": 445},
    {"symbol": "GODREJCP.NS", "name": "Godrej Consumer", "sector": "FMCG", "base_price": 1180},
    {"symbol": "DABUR.NS", "name": "Dabur India", "sector": "FMCG", "base_price": 545},
    {"symbol": "PIDILITIND.NS", "name": "Pidilite Industries", "sector": "Chemicals", "base_price": 2950},
    {"symbol": "SIEMENS.NS", "name": "Siemens", "sector": "Engineering", "base_price": 6850},
    {"symbol": "DLF.NS", "name": "DLF Limited", "sector": "Real Estate", "base_price": 825},
    {"symbol": "GAIL.NS", "name": "GAIL India", "sector": "Energy", "base_price": 195},
    {"symbol": "AMBUJACEM.NS", "name": "Ambuja Cements", "sector": "Cement", "base_price": 585},
    {"symbol": "BANKBARODA.NS", "name": "Bank of Baroda", "sector": "Banking", "base_price": 245},
    {"symbol": "INDIGO.NS", "name": "InterGlobe Aviation", "sector": "Aviation", "base_price": 4250},
    {"symbol": "HAVELLS.NS", "name": "Havells India", "sector": "Consumer Goods", "base_price": 1580},
    {"symbol": "BOSCHLTD.NS", "name": "Bosch Limited", "sector": "Automobile", "base_price": 32500},
    {"symbol": "MARICO.NS", "name": "Marico Limited", "sector": "FMCG", "base_price": 625},
    {"symbol": "BERGEPAINT.NS", "name": "Berger Paints", "sector": "Consumer Goods", "base_price": 485},
    {"symbol": "COLPAL.NS", "name": "Colgate-Palmolive", "sector": "FMCG", "base_price": 2850},
    {"symbol": "MOTHERSON.NS", "name": "Samvardhana Motherson", "sector": "Automobile", "base_price": 145},
    {"symbol": "TORNTPHARM.NS", "name": "Torrent Pharma", "sector": "Pharma", "base_price": 3250},
    {"symbol": "LUPIN.NS", "name": "Lupin Limited", "sector": "Pharma", "base_price": 2050},
    {"symbol": "BIOCON.NS", "name": "Biocon Limited", "sector": "Pharma", "base_price": 325},
    {"symbol": "MCDOWELL-N.NS", "name": "United Spirits", "sector": "Beverages", "base_price": 1250},
    {"symbol": "TATAPOWER.NS", "name": "Tata Power", "sector": "Power", "base_price": 425},
    {"symbol": "ADANIGREEN.NS", "name": "Adani Green Energy", "sector": "Power", "base_price": 1850},
    {"symbol": "ZOMATO.NS", "name": "Zomato", "sector": "Food Tech", "base_price": 245},
    {"symbol": "PAYTM.NS", "name": "Paytm", "sector": "Fintech", "base_price": 925},
    {"symbol": "NYKAA.NS", "name": "Nykaa", "sector": "E-commerce", "base_price": 185},
    {"symbol": "DMART.NS", "name": "Avenue Supermarts", "sector": "Retail", "base_price": 4250},
    {"symbol": "IRCTC.NS", "name": "IRCTC", "sector": "Travel", "base_price": 825},
    {"symbol": "TRENT.NS", "name": "Trent Limited", "sector": "Retail", "base_price": 6850},
    {"symbol": "PAGEIND.NS", "name": "Page Industries", "sector": "Textile", "base_price": 42500},
    {"symbol": "ABCAPITAL.NS", "name": "Aditya Birla Capital", "sector": "Finance", "base_price": 225},
    {"symbol": "LICHSGFIN.NS", "name": "LIC Housing Finance", "sector": "Finance", "base_price": 625},
    {"symbol": "PFC.NS", "name": "Power Finance Corp", "sector": "Finance", "base_price": 445},
    {"symbol": "RECLTD.NS", "name": "REC Limited", "sector": "Finance", "base_price": 485},
    {"symbol": "MUTHOOTFIN.NS", "name": "Muthoot Finance", "sector": "Finance", "base_price": 1850},
    {"symbol": "CHOLAFIN.NS", "name": "Cholamandalam Finance", "sector": "Finance", "base_price": 1450},
    {"symbol": "SBICARD.NS", "name": "SBI Cards", "sector": "Finance", "base_price": 825},
    {"symbol": "BANDHANBNK.NS", "name": "Bandhan Bank", "sector": "Banking", "base_price": 245},
    {"symbol": "IDFCFIRSTB.NS", "name": "IDFC First Bank", "sector": "Banking", "base_price": 95},
    {"symbol": "FEDERALBNK.NS", "name": "Federal Bank", "sector": "Banking", "base_price": 165},
    {"symbol": "PNB.NS", "name": "Punjab National Bank", "sector": "Banking", "base_price": 125},
    {"symbol": "CANBK.NS", "name": "Canara Bank", "sector": "Banking", "base_price": 105},
    {"symbol": "UNIONBANK.NS", "name": "Union Bank of India", "sector": "Banking", "base_price": 125},
    {"symbol": "IDEA.NS", "name": "Vodafone Idea", "sector": "Telecom", "base_price": 12},
    {"symbol": "DIXON.NS", "name": "Dixon Technologies", "sector": "Electronics", "base_price": 14500},
    {"symbol": "POLYCAB.NS", "name": "Polycab India", "sector": "Cables", "base_price": 6250},
    {"symbol": "VOLTAS.NS", "name": "Voltas Limited", "sector": "Consumer Goods", "base_price": 1650},
    {"symbol": "WHIRLPOOL.NS", "name": "Whirlpool India", "sector": "Consumer Goods", "base_price": 1850},
    {"symbol": "CROMPTON.NS", "name": "Crompton Greaves", "sector": "Consumer Goods", "base_price": 425},
]


def seeded_random(seed: int):
    """Seeded pseudo-random number generator."""
    s = seed
    def rand():
        nonlocal s
        s = (s * 16807) % 2147483647
        return s / 2147483647
    return rand


def generate_stock_history(base_price: float, seed: int, days: int = 365) -> List[dict]:
    """Generate realistic stock history."""
    rand = seeded_random(seed)
    entries = []
    price = base_price
    start_date = datetime.now() - timedelta(days=days)
    
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        # Skip weekends
        if current_date.weekday() >= 5:
            continue
        
        change = (rand() - 0.48) * price * 0.03
        open_price = price
        close_price = price + change
        high_price = max(open_price, close_price) + rand() * price * 0.01
        low_price = min(open_price, close_price) - rand() * price * 0.01
        volume = int(500000 + rand() * 5000000)
        daily_return = ((close_price - open_price) / open_price) * 100
        
        entries.append({
            "date": current_date.date(),
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "close": round(close_price, 2),
            "volume": volume,
            "daily_return": round(daily_return, 2),
            "ma7": 0,
        })
        price = close_price
    
    # Calculate 7-day moving average
    for i in range(len(entries)):
        if i < 6:
            entries[i]["ma7"] = entries[i]["close"]
        else:
            sum_close = sum(e["close"] for e in entries[i-6:i+1])
            entries[i]["ma7"] = round(sum_close / 7, 2)
    
    return entries


def populate_database(db: Session):
    """Populate database with companies and stock data."""
    # Clear existing data
    db.query(StockData).delete()
    db.query(Company).delete()
    db.commit()
    
    # Add companies and their stock data
    for idx, company_data in enumerate(COMPANIES_BASE):
        # Add company
        company = Company(
            symbol=company_data["symbol"],
            name=company_data["name"],
            sector=company_data["sector"],
            base_price=company_data["base_price"]
        )
        db.add(company)
        
        # Generate and add stock data
        history = generate_stock_history(
            company_data["base_price"],
            (idx + 1) * 12345,
            365
        )
        
        for entry in history:
            stock_data = StockData(
                symbol=company_data["symbol"],
                date=entry["date"],
                open=entry["open"],
                high=entry["high"],
                low=entry["low"],
                close=entry["close"],
                volume=entry["volume"],
                daily_return=entry["daily_return"],
                ma7=entry["ma7"]
            )
            db.add(stock_data)
    
    db.commit()
    print(f"✅ Database populated with {len(COMPANIES_BASE)} companies and their historical data")


def calculate_intelligence_score(stock_data: List[StockData]) -> int:
    """Calculate intelligence score (0-100) based on recent performance."""
    recent = stock_data[-30:] if len(stock_data) >= 30 else stock_data
    if len(recent) < 10:
        return 50
    
    # Momentum (40%)
    momentum = ((recent[-1].close - recent[0].close) / recent[0].close) * 100
    momentum_score = min(100, max(0, 50 + momentum * 5))
    
    # Inverse Volatility (30%)
    returns = [e.daily_return for e in recent]
    avg_return = sum(returns) / len(returns)
    variance = sum((r - avg_return) ** 2 for r in returns) / len(returns)
    std_dev = variance ** 0.5
    vol_score = min(100, max(0, 100 - std_dev * 30))
    
    # Trend Strength (30%)
    trend_up = sum(1 for e in recent if e.daily_return > 0)
    trend_score = (trend_up / len(recent)) * 100
    
    return round(momentum_score * 0.4 + vol_score * 0.3 + trend_score * 0.3)
