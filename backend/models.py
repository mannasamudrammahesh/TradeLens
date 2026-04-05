"""Pydantic models for API requests/responses."""
from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class CompanyResponse(BaseModel):
    """Company information response."""
    symbol: str
    name: str
    sector: str
    price: float
    change: float
    changePercent: float
    intelligenceScore: int
    high52w: float
    low52w: float
    avgClose: float


class StockDataResponse(BaseModel):
    """Stock data point response."""
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    dailyReturn: float
    ma7: float


class SummaryResponse(BaseModel):
    """Stock summary response."""
    symbol: str
    name: str
    sector: str
    high52w: float
    low52w: float
    avgClose: float
    currentPrice: float
    change: float
    changePercent: float


class CompareResponse(BaseModel):
    """Compare two stocks response."""
    symbol1: str
    symbol2: str
    name1: str
    name2: str
    price1: float
    price2: float
    change1: float
    change2: float
    changePercent1: float
    changePercent2: float
    correlation: float
    performance30d1: float
    performance30d2: float
