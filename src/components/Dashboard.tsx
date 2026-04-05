import { useState, useMemo, useEffect } from "react";
import { Search, Download, TrendingUp, TrendingDown, Activity, Brain, BarChart3, ChevronRight, Wifi, WifiOff } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Area, ReferenceLine,
} from "recharts";
import { getCompanies, getStockData, getAIInsight, exportCSV, type Company, type AIInsight } from "@/lib/stockData";
import { fetchCompanies, fetchStockData, checkBackendHealth, isBackendAvailable } from "@/lib/api";

/** Score badge color */
function scoreColor(score: number): string {
  if (score >= 70) return "text-chart-green";
  if (score >= 40) return "text-chart-orange";
  return "text-chart-red";
}

function scoreBg(score: number): string {
  if (score >= 70) return "bg-chart-green/10 border-chart-green/30";
  if (score >= 40) return "bg-chart-orange/10 border-chart-orange/30";
  return "bg-chart-red/10 border-chart-red/30";
}

const fmt = (n: number) =>
  n >= 1000 ? `₹${(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : `₹${n.toFixed(2)}`;

const fmtVol = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [search, setSearch] = useState("");
  const [days, setDays] = useState<30 | 90>(30);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check backend health and load companies
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const isHealthy = await checkBackendHealth();
      setBackendAvailable(isHealthy);

      try {
        if (isHealthy) {
          const data = await fetchCompanies();
          setCompanies(data);
          if (data.length > 0 && !selectedSymbol) {
            setSelectedSymbol(data[0].symbol);
          }
        } else {
          // Fallback to mock data
          const mockData = getCompanies();
          setCompanies(mockData);
          if (mockData.length > 0 && !selectedSymbol) {
            setSelectedSymbol(mockData[0].symbol);
          }
        }
      } catch (error) {
        console.error("Failed to load companies:", error);
        // Fallback to mock data
        const mockData = getCompanies();
        setCompanies(mockData);
        if (mockData.length > 0 && !selectedSymbol) {
          setSelectedSymbol(mockData[0].symbol);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filtered = useMemo(
    () =>
      companies.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.symbol.toLowerCase().includes(search.toLowerCase())
      ),
    [companies, search]
  );

  const selected = companies.find((c) => c.symbol === selectedSymbol);
  
  // Load chart data - use backend if available, otherwise mock
  const [chartData, setChartData] = useState<any[]>([]);
  useEffect(() => {
    const loadChartData = async () => {
      if (!selectedSymbol) return;
      
      try {
        if (backendAvailable) {
          const data = await fetchStockData(selectedSymbol, days);
          setChartData(data);
        } else {
          const mockData = getStockData(selectedSymbol, days);
          setChartData(mockData);
        }
      } catch (error) {
        console.error("Failed to load chart data:", error);
        const mockData = getStockData(selectedSymbol, days);
        setChartData(mockData);
      }
    };

    loadChartData();
  }, [selectedSymbol, days, backendAvailable]);

  const insight = useMemo(() => getAIInsight(selectedSymbol), [selectedSymbol]);

  const gainers = useMemo(
    () => [...companies].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3),
    [companies]
  );
  const losers = useMemo(
    () => [...companies].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3),
    [companies]
  );

  const handleExport = () => {
    const csv = exportCSV(selectedSymbol);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedSymbol}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">TradeLens</h1>
            {backendAvailable ? (
              <Wifi className="w-4 h-4 text-chart-green ml-auto" title="Backend Connected" />
            ) : (
              <WifiOff className="w-4 h-4 text-chart-orange ml-auto" title="Using Mock Data" />
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary text-foreground text-sm pl-9 pr-3 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filtered.map((c) => (
            <button
              key={c.symbol}
              onClick={() => setSelectedSymbol(c.symbol)}
              className={`w-full text-left px-3 py-3 rounded-lg mb-1 transition-all group ${
                c.symbol === selectedSymbol
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-secondary border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.symbol.replace(".NS", "")}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-sm font-medium text-foreground">{fmt(c.price)}</p>
                  <div className="flex items-center justify-end gap-1">
                    <span className={`text-xs font-medium ${c.change >= 0 ? "text-chart-green" : "text-chart-red"}`}>
                      {c.change >= 0 ? "+" : ""}{c.changePercent.toFixed(2)}%
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${scoreBg(c.intelligenceScore)} ${scoreColor(c.intelligenceScore)}`}>
                      {c.intelligenceScore}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-[10px] text-muted-foreground text-center">
            TradeLens © Jarnox 2026 • {backendAvailable ? "Live API" : "Mock Data"}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Market Snapshot */}
        <div className="p-6 pb-0">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Market Snapshot</h2>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {gainers.map((c) => (
              <MoverCard key={c.symbol} company={c} type="gainer" onClick={() => setSelectedSymbol(c.symbol)} />
            ))}
            {losers.map((c) => (
              <MoverCard key={c.symbol} company={c} type="loser" onClick={() => setSelectedSymbol(c.symbol)} />
            ))}
          </div>
        </div>

        {/* Selected Stock View */}
        {selected && (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selected.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xl font-semibold text-foreground">{fmt(selected.price)}</span>
                  <span className={`text-sm font-medium ${selected.change >= 0 ? "text-chart-green" : "text-chart-red"}`}>
                    {selected.change >= 0 ? "+" : ""}{selected.change.toFixed(2)} ({selected.changePercent.toFixed(2)}%)
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full border font-bold ${scoreBg(selected.intelligenceScore)} ${scoreColor(selected.intelligenceScore)}`}>
                    Score: {selected.intelligenceScore}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-secondary rounded-lg border border-border">
                  {([30, 90] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        days === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d}D
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="glass rounded-xl p-5 mb-5">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-3 h-0.5 bg-chart-blue rounded-full" /> Close
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-3 h-0.5 bg-chart-orange rounded-full" /> 7-Day MA
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-3 h-1.5 bg-chart-purple/40 rounded-sm" /> Volume
                </span>
              </div>
              <ResponsiveContainer width="100%" height={340}>
                <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(200,80%,50%)" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="hsl(200,80%,50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }}
                    tickFormatter={(v: string) => v.slice(5)}
                    interval={Math.floor(chartData.length / 6)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="price"
                    orientation="left"
                    tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }}
                    tickFormatter={(v: number) => `₹${v}`}
                    axisLine={false}
                    tickLine={false}
                    domain={["auto", "auto"]}
                  />
                  <YAxis
                    yAxisId="vol"
                    orientation="right"
                    tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }}
                    tickFormatter={fmtVol}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(220,18%,10%)",
                      border: "1px solid hsl(220,14%,18%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "hsl(210,20%,92%)",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "volume" ? fmtVol(value) : fmt(value),
                      name === "close" ? "Close" : name === "ma7" ? "7-Day MA" : "Volume",
                    ]}
                    labelFormatter={(l: string) => `Date: ${l}`}
                  />
                  <Bar yAxisId="vol" dataKey="volume" fill="hsl(270,60%,55%)" opacity={0.25} radius={[2, 2, 0, 0]} />
                  <Area yAxisId="price" type="monotone" dataKey="close" stroke="none" fill="url(#areaGrad)" />
                  <Line yAxisId="price" type="monotone" dataKey="close" stroke="hsl(200,80%,50%)" strokeWidth={2} dot={false} />
                  <Line yAxisId="price" type="monotone" dataKey="ma7" stroke="hsl(30,90%,55%)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Stats + AI Insight Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Stats */}
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5" /> Key Stats
                </h3>
                <div className="space-y-3">
                  <StatRow label="52-Week High" value={fmt(selected.high52w)} />
                  <StatRow label="52-Week Low" value={fmt(selected.low52w)} />
                  <StatRow label="Avg Close (1Y)" value={fmt(selected.avgClose)} />
                  <StatRow label="Sector" value={selected.sector} />
                  <StatRow label="Intelligence Score" value={`${selected.intelligenceScore}/100`} highlight={scoreColor(selected.intelligenceScore)} />
                </div>
              </div>

              {/* AI Insight */}
              {insight && (
                <div className="lg:col-span-2 glass rounded-xl p-5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5" /> AI Insight — 5-Day Prediction
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    {insight.trend === "UP" ? (
                      <TrendingUp className="w-6 h-6 text-chart-green" />
                    ) : insight.trend === "DOWN" ? (
                      <TrendingDown className="w-6 h-6 text-chart-red" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-muted-foreground" />
                    )}
                    <span
                      className={`text-lg font-bold ${
                        insight.trend === "UP" ? "text-chart-green" : insight.trend === "DOWN" ? "text-chart-red" : "text-muted-foreground"
                      }`}
                    >
                      {insight.trend}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">Confidence: {insight.confidence}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{insight.explanation}</p>
                  {insight.predictedPrices.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">Predicted (5d):</span>
                      {insight.predictedPrices.map((p, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {fmt(p)}
                          {i < insight.predictedPrices.length - 1 && <ChevronRight className="w-3 h-3" />}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function MoverCard({ company, type, onClick }: { company: Company; type: "gainer" | "loser"; onClick: () => void }) {
  const isGainer = type === "gainer";
  return (
    <button
      onClick={onClick}
      className={`glass rounded-lg p-3 text-left transition-all hover:scale-[1.02] ${isGainer ? "glow-green" : "glow-red"}`}
    >
      <p className="text-[10px] text-muted-foreground truncate">{company.symbol.replace(".NS", "")}</p>
      <p className="text-sm font-semibold text-foreground mt-0.5">{fmt(company.price)}</p>
      <div className="flex items-center gap-1 mt-1">
        {isGainer ? <TrendingUp className="w-3 h-3 text-chart-green" /> : <TrendingDown className="w-3 h-3 text-chart-red" />}
        <span className={`text-xs font-medium ${isGainer ? "text-chart-green" : "text-chart-red"}`}>
          {company.changePercent >= 0 ? "+" : ""}{company.changePercent.toFixed(2)}%
        </span>
      </div>
    </button>
  );
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${highlight ?? "text-foreground"}`}>{value}</span>
    </div>
  );
}
