/**
 * API service for connecting to the FastAPI backend.
 * Falls back to mock data if backend is unavailable.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

export interface CompareData {
  symbol1: string;
  symbol2: string;
  name1: string;
  name2: string;
  price1: number;
  price2: number;
  change1: number;
  change2: number;
  changePercent1: number;
  changePercent2: number;
  correlation: number;
  performance30d1: number;
  performance30d2: number;
}

let useBackend = true;

/**
 * Fetch companies from backend API.
 */
export async function fetchCompanies(): Promise<Company[]> {
  if (!useBackend) {
    throw new Error("Backend unavailable");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/companies`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Backend API unavailable, falling back to mock data:", error);
    useBackend = false;
    throw error;
  }
}

/**
 * Fetch stock data for a specific symbol.
 */
export async function fetchStockData(symbol: string, days: number = 30): Promise<StockEntry[]> {
  if (!useBackend) {
    throw new Error("Backend unavailable");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/data/${symbol}?days=${days}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch data for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Fetch summary for a specific symbol.
 */
export async function fetchSummary(symbol: string) {
  if (!useBackend) {
    throw new Error("Backend unavailable");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/summary/${symbol}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch summary for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Compare two stocks.
 */
export async function fetchCompare(symbol1: string, symbol2: string): Promise<CompareData> {
  if (!useBackend) {
    throw new Error("Backend unavailable");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/compare?symbol1=${symbol1}&symbol2=${symbol2}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to compare ${symbol1} and ${symbol2}:`, error);
    throw error;
  }
}

/**
 * Check if backend is available.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, { method: "GET" });
    useBackend = response.ok;
    return response.ok;
  } catch {
    useBackend = false;
    return false;
  }
}

/**
 * Get backend status.
 */
export function isBackendAvailable(): boolean {
  return useBackend;
}
