/**
 * Mock stock data generator for TradeLens dashboard.
 * Simulates realistic NSE India stock data with technical indicators.
 */

export interface StockEntry {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  dailyReturn: number;
  ma7: number;
}

export interface Company {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  intelligenceScore: number;
  high52w: number;
  low52w: number;
  avgClose: number;
}

export interface AIInsight {
  trend: "UP" | "DOWN" | "NEUTRAL";
  confidence: number;
  explanation: string;
  predictedPrices: number[];
}

const COMPANIES_BASE: { symbol: string; name: string; sector: string; basePrice: number }[] = [
  // Top 100 NSE Stocks by Market Cap
  { symbol: "RELIANCE.NS", name: "Reliance Industries", sector: "Energy", basePrice: 2450 },
  { symbol: "TCS.NS", name: "Tata Consultancy Services", sector: "IT", basePrice: 3680 },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", sector: "Banking", basePrice: 1680 },
  { symbol: "INFY.NS", name: "Infosys", sector: "IT", basePrice: 1520 },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank", sector: "Banking", basePrice: 1150 },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever", sector: "FMCG", basePrice: 2580 },
  { symbol: "ITC.NS", name: "ITC Limited", sector: "FMCG", basePrice: 445 },
  { symbol: "SBIN.NS", name: "State Bank of India", sector: "Banking", basePrice: 780 },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", sector: "Telecom", basePrice: 1620 },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", sector: "Banking", basePrice: 1850 },
  { symbol: "LT.NS", name: "Larsen & Toubro", sector: "Infrastructure", basePrice: 3380 },
  { symbol: "HCLTECH.NS", name: "HCL Technologies", sector: "IT", basePrice: 1480 },
  { symbol: "AXISBANK.NS", name: "Axis Bank", sector: "Banking", basePrice: 1120 },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints", sector: "Consumer Goods", basePrice: 2950 },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki", sector: "Automobile", basePrice: 11500 },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharmaceutical", sector: "Pharma", basePrice: 1680 },
  { symbol: "TITAN.NS", name: "Titan Company", sector: "Consumer Goods", basePrice: 3420 },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance", sector: "Finance", basePrice: 7250 },
  { symbol: "WIPRO.NS", name: "Wipro", sector: "IT", basePrice: 445 },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement", sector: "Cement", basePrice: 9850 },
  { symbol: "NESTLEIND.NS", name: "Nestle India", sector: "FMCG", basePrice: 24500 },
  { symbol: "ONGC.NS", name: "Oil & Natural Gas Corp", sector: "Energy", basePrice: 245 },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", sector: "Automobile", basePrice: 920 },
  { symbol: "NTPC.NS", name: "NTPC Limited", sector: "Power", basePrice: 355 },
  { symbol: "POWERGRID.NS", name: "Power Grid Corp", sector: "Power", basePrice: 285 },
  { symbol: "TECHM.NS", name: "Tech Mahindra", sector: "IT", basePrice: 1650 },
  { symbol: "M&M.NS", name: "Mahindra & Mahindra", sector: "Automobile", basePrice: 2850 },
  { symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv", sector: "Finance", basePrice: 1680 },
  { symbol: "ADANIPORTS.NS", name: "Adani Ports", sector: "Infrastructure", basePrice: 1280 },
  { symbol: "COALINDIA.NS", name: "Coal India", sector: "Mining", basePrice: 425 },
  { symbol: "TATASTEEL.NS", name: "Tata Steel", sector: "Steel", basePrice: 145 },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel", sector: "Steel", basePrice: 920 },
  { symbol: "HINDALCO.NS", name: "Hindalco Industries", sector: "Metals", basePrice: 645 },
  { symbol: "INDUSINDBK.NS", name: "IndusInd Bank", sector: "Banking", basePrice: 1450 },
  { symbol: "DIVISLAB.NS", name: "Divi's Laboratories", sector: "Pharma", basePrice: 3850 },
  { symbol: "DRREDDY.NS", name: "Dr. Reddy's Labs", sector: "Pharma", basePrice: 6250 },
  { symbol: "CIPLA.NS", name: "Cipla", sector: "Pharma", basePrice: 1450 },
  { symbol: "EICHERMOT.NS", name: "Eicher Motors", sector: "Automobile", basePrice: 4850 },
  { symbol: "GRASIM.NS", name: "Grasim Industries", sector: "Cement", basePrice: 2450 },
  { symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp", sector: "Automobile", basePrice: 4650 },
  { symbol: "BRITANNIA.NS", name: "Britannia Industries", sector: "FMCG", basePrice: 5250 },
  { symbol: "BPCL.NS", name: "Bharat Petroleum", sector: "Energy", basePrice: 585 },
  { symbol: "SHREECEM.NS", name: "Shree Cement", sector: "Cement", basePrice: 27500 },
  { symbol: "APOLLOHOSP.NS", name: "Apollo Hospitals", sector: "Healthcare", basePrice: 6450 },
  { symbol: "ADANIENT.NS", name: "Adani Enterprises", sector: "Conglomerate", basePrice: 2850 },
  { symbol: "TATACONSUM.NS", name: "Tata Consumer Products", sector: "FMCG", basePrice: 1120 },
  { symbol: "SBILIFE.NS", name: "SBI Life Insurance", sector: "Insurance", basePrice: 1580 },
  { symbol: "HDFCLIFE.NS", name: "HDFC Life Insurance", sector: "Insurance", basePrice: 685 },
  { symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto", sector: "Automobile", basePrice: 9250 },
  { symbol: "VEDL.NS", name: "Vedanta Limited", sector: "Mining", basePrice: 445 },
  { symbol: "GODREJCP.NS", name: "Godrej Consumer", sector: "FMCG", basePrice: 1180 },
  { symbol: "DABUR.NS", name: "Dabur India", sector: "FMCG", basePrice: 545 },
  { symbol: "PIDILITIND.NS", name: "Pidilite Industries", sector: "Chemicals", basePrice: 2950 },
  { symbol: "SIEMENS.NS", name: "Siemens", sector: "Engineering", basePrice: 6850 },
  { symbol: "DLF.NS", name: "DLF Limited", sector: "Real Estate", basePrice: 825 },
  { symbol: "GAIL.NS", name: "GAIL India", sector: "Energy", basePrice: 195 },
  { symbol: "AMBUJACEM.NS", name: "Ambuja Cements", sector: "Cement", basePrice: 585 },
  { symbol: "BANKBARODA.NS", name: "Bank of Baroda", sector: "Banking", basePrice: 245 },
  { symbol: "INDIGO.NS", name: "InterGlobe Aviation", sector: "Aviation", basePrice: 4250 },
  { symbol: "HAVELLS.NS", name: "Havells India", sector: "Consumer Goods", basePrice: 1580 },
  { symbol: "BOSCHLTD.NS", name: "Bosch Limited", sector: "Automobile", basePrice: 32500 },
  { symbol: "MARICO.NS", name: "Marico Limited", sector: "FMCG", basePrice: 625 },
  { symbol: "BERGEPAINT.NS", name: "Berger Paints", sector: "Consumer Goods", basePrice: 485 },
  { symbol: "COLPAL.NS", name: "Colgate-Palmolive", sector: "FMCG", basePrice: 2850 },
  { symbol: "MOTHERSON.NS", name: "Samvardhana Motherson", sector: "Automobile", basePrice: 145 },
  { symbol: "TORNTPHARM.NS", name: "Torrent Pharma", sector: "Pharma", basePrice: 3250 },
  { symbol: "LUPIN.NS", name: "Lupin Limited", sector: "Pharma", basePrice: 2050 },
  { symbol: "BIOCON.NS", name: "Biocon Limited", sector: "Pharma", basePrice: 325 },
  { symbol: "MCDOWELL-N.NS", name: "United Spirits", sector: "Beverages", basePrice: 1250 },
  { symbol: "TATAPOWER.NS", name: "Tata Power", sector: "Power", basePrice: 425 },
  { symbol: "ADANIGREEN.NS", name: "Adani Green Energy", sector: "Power", basePrice: 1850 },
  { symbol: "ZOMATO.NS", name: "Zomato", sector: "Food Tech", basePrice: 245 },
  { symbol: "PAYTM.NS", name: "Paytm", sector: "Fintech", basePrice: 925 },
  { symbol: "NYKAA.NS", name: "Nykaa", sector: "E-commerce", basePrice: 185 },
  { symbol: "DMART.NS", name: "Avenue Supermarts", sector: "Retail", basePrice: 4250 },
  { symbol: "IRCTC.NS", name: "IRCTC", sector: "Travel", basePrice: 825 },
  { symbol: "TRENT.NS", name: "Trent Limited", sector: "Retail", basePrice: 6850 },
  { symbol: "PAGEIND.NS", name: "Page Industries", sector: "Textile", basePrice: 42500 },
  { symbol: "ABCAPITAL.NS", name: "Aditya Birla Capital", sector: "Finance", basePrice: 225 },
  { symbol: "LICHSGFIN.NS", name: "LIC Housing Finance", sector: "Finance", basePrice: 625 },
  { symbol: "PFC.NS", name: "Power Finance Corp", sector: "Finance", basePrice: 445 },
  { symbol: "RECLTD.NS", name: "REC Limited", sector: "Finance", basePrice: 485 },
  { symbol: "MUTHOOTFIN.NS", name: "Muthoot Finance", sector: "Finance", basePrice: 1850 },
  { symbol: "CHOLAFIN.NS", name: "Cholamandalam Finance", sector: "Finance", basePrice: 1450 },
  { symbol: "SBICARD.NS", name: "SBI Cards", sector: "Finance", basePrice: 825 },
  { symbol: "BANDHANBNK.NS", name: "Bandhan Bank", sector: "Banking", basePrice: 245 },
  { symbol: "IDFCFIRSTB.NS", name: "IDFC First Bank", sector: "Banking", basePrice: 95 },
  { symbol: "FEDERALBNK.NS", name: "Federal Bank", sector: "Banking", basePrice: 165 },
  { symbol: "PNB.NS", name: "Punjab National Bank", sector: "Banking", basePrice: 125 },
  { symbol: "CANBK.NS", name: "Canara Bank", sector: "Banking", basePrice: 105 },
  { symbol: "UNIONBANK.NS", name: "Union Bank of India", sector: "Banking", basePrice: 125 },
  { symbol: "IDEA.NS", name: "Vodafone Idea", sector: "Telecom", basePrice: 12 },
  { symbol: "DIXON.NS", name: "Dixon Technologies", sector: "Electronics", basePrice: 14500 },
  { symbol: "POLYCAB.NS", name: "Polycab India", sector: "Cables", basePrice: 6250 },
  { symbol: "VOLTAS.NS", name: "Voltas Limited", sector: "Consumer Goods", basePrice: 1650 },
  { symbol: "WHIRLPOOL.NS", name: "Whirlpool India", sector: "Consumer Goods", basePrice: 1850 },
  { symbol: "CROMPTON.NS", name: "Crompton Greaves", sector: "Consumer Goods", basePrice: 425 },
];

/** Seeded pseudo-random number generator */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/** Generate realistic stock history for a given base price */
function generateHistory(basePrice: number, seed: number, days: number = 365): StockEntry[] {
  const rand = seededRandom(seed);
  const entries: StockEntry[] = [];
  let price = basePrice;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const change = (rand() - 0.48) * price * 0.03;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + rand() * price * 0.01;
    const low = Math.min(open, close) - rand() * price * 0.01;
    const volume = Math.floor(500000 + rand() * 5000000);
    const dailyReturn = ((close - open) / open) * 100;

    entries.push({
      date: date.toISOString().split("T")[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
      dailyReturn: +dailyReturn.toFixed(2),
      ma7: 0,
    });
    price = close;
  }

  // Calculate 7-day MA
  for (let i = 0; i < entries.length; i++) {
    if (i < 6) {
      entries[i].ma7 = entries[i].close;
    } else {
      const sum = entries.slice(i - 6, i + 1).reduce((a, e) => a + e.close, 0);
      entries[i].ma7 = +(sum / 7).toFixed(2);
    }
  }

  return entries;
}

/** Calculate Intelligence Score (0-100) */
function calcIntelligenceScore(entries: StockEntry[]): number {
  const recent = entries.slice(-30);
  if (recent.length < 10) return 50;

  // Momentum (40%)
  const momentum = ((recent[recent.length - 1].close - recent[0].close) / recent[0].close) * 100;
  const momentumScore = Math.min(100, Math.max(0, 50 + momentum * 5));

  // Inverse Volatility (30%)
  const returns = recent.map((e) => e.dailyReturn);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((a, r) => a + (r - avgReturn) ** 2, 0) / returns.length);
  const volScore = Math.min(100, Math.max(0, 100 - stdDev * 30));

  // Trend Strength (30%)
  const trendUp = recent.filter((e) => e.dailyReturn > 0).length;
  const trendScore = (trendUp / recent.length) * 100;

  return Math.round(momentumScore * 0.4 + volScore * 0.3 + trendScore * 0.3);
}

/** Generate AI insight based on data */
function generateInsight(entries: StockEntry[], companyName: string): AIInsight {
  const recent = entries.slice(-30);
  const last = recent[recent.length - 1];
  const first = recent[0];
  const momentum = ((last.close - first.close) / first.close) * 100;
  const avgDailyReturn = recent.reduce((a, e) => a + e.dailyReturn, 0) / recent.length;

  let trend: "UP" | "DOWN" | "NEUTRAL";
  let confidence: number;

  if (momentum > 2) {
    trend = "UP";
    confidence = Math.min(88, 60 + Math.abs(momentum) * 3);
  } else if (momentum < -2) {
    trend = "DOWN";
    confidence = Math.min(85, 55 + Math.abs(momentum) * 3);
  } else {
    trend = "NEUTRAL";
    confidence = 45 + Math.abs(momentum) * 2;
  }
  confidence = Math.round(confidence);

  const predictedPrices: number[] = [];
  let p = last.close;
  for (let i = 0; i < 5; i++) {
    p += p * (avgDailyReturn / 100) + (Math.random() - 0.5) * p * 0.005;
    predictedPrices.push(+p.toFixed(2));
  }

  const explanations: Record<string, string> = {
    UP: `${companyName} shows strong bullish momentum with a ${momentum.toFixed(1)}% gain over the last 30 days. The 7-day moving average is trending above the price baseline, suggesting continued upward pressure. Technical indicators point to sustained buying interest.`,
    DOWN: `${companyName} has experienced a ${Math.abs(momentum).toFixed(1)}% decline over the past month. The moving average has crossed below key support levels. Increased selling volume suggests caution — consider monitoring for reversal signals before entry.`,
    NEUTRAL: `${companyName} is consolidating in a tight range with minimal directional bias. The stock has moved ${Math.abs(momentum).toFixed(1)}% over 30 days, indicating market indecision. Watch for a breakout above resistance or breakdown below support for the next clear move.`,
  };

  return {
    trend,
    confidence,
    explanation: explanations[trend],
    predictedPrices,
  };
}

// Pre-generate all data
const dataCache = new Map<string, StockEntry[]>();
const companiesCache: Company[] = [];

COMPANIES_BASE.forEach((c, idx) => {
  const history = generateHistory(c.basePrice, (idx + 1) * 12345, 365);
  dataCache.set(c.symbol, history);

  const latest = history[history.length - 1];
  const prev = history[history.length - 2];
  const change = latest.close - prev.close;
  const changePercent = (change / prev.close) * 100;
  const closes = history.map((e) => e.close);

  companiesCache.push({
    symbol: c.symbol,
    name: c.name,
    sector: c.sector,
    price: latest.close,
    change: +change.toFixed(2),
    changePercent: +changePercent.toFixed(2),
    intelligenceScore: calcIntelligenceScore(history),
    high52w: +Math.max(...closes).toFixed(2),
    low52w: +Math.min(...closes).toFixed(2),
    avgClose: +(closes.reduce((a, b) => a + b, 0) / closes.length).toFixed(2),
  });
});

export function getCompanies(): Company[] {
  return companiesCache;
}

export function getStockData(symbol: string, days: number = 30): StockEntry[] {
  const all = dataCache.get(symbol);
  if (!all) return [];
  return all.slice(-days);
}

export function getStockSummary(symbol: string) {
  const company = companiesCache.find((c) => c.symbol === symbol);
  if (!company) return null;
  return company;
}

export function getAIInsight(symbol: string): AIInsight | null {
  const data = dataCache.get(symbol);
  const company = companiesCache.find((c) => c.symbol === symbol);
  if (!data || !company) return null;
  return generateInsight(data, company.name);
}

export function exportCSV(symbol: string): string {
  const data = dataCache.get(symbol);
  if (!data) return "";
  const header = "Date,Open,High,Low,Close,Volume,Daily Return,7-Day MA\n";
  const rows = data.map((e) => `${e.date},${e.open},${e.high},${e.low},${e.close},${e.volume},${e.dailyReturn},${e.ma7}`).join("\n");
  return header + rows;
}
