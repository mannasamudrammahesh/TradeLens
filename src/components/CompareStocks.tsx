import { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, ArrowRight, BarChart3 } from "lucide-react";
import { fetchCompare, type Company, type CompareData } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CompareStocksProps {
  companies: Company[];
  onClose: () => void;
  backendAvailable: boolean;
}

const fmt = (n: number) =>
  n >= 1000 ? `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : `₹${n.toFixed(2)}`;

export default function CompareStocks({ companies, onClose, backendAvailable }: CompareStocksProps) {
  const [symbol1, setSymbol1] = useState(companies[0]?.symbol || "");
  const [symbol2, setSymbol2] = useState(companies[1]?.symbol || "");
  const [compareData, setCompareData] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    if (!symbol1 || !symbol2) {
      setError("Please select both stocks");
      return;
    }

    if (symbol1 === symbol2) {
      setError("Please select different stocks");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (backendAvailable) {
        const data = await fetchCompare(symbol1, symbol2);
        setCompareData(data);
      } else {
        // Mock comparison data
        const stock1 = companies.find((c) => c.symbol === symbol1);
        const stock2 = companies.find((c) => c.symbol === symbol2);

        if (stock1 && stock2) {
          setCompareData({
            symbol1: stock1.symbol,
            symbol2: stock2.symbol,
            name1: stock1.name,
            name2: stock2.name,
            price1: stock1.price,
            price2: stock2.price,
            change1: stock1.change,
            change2: stock2.change,
            changePercent1: stock1.changePercent,
            changePercent2: stock2.changePercent,
            correlation: Math.random() * 2 - 1, // Random correlation between -1 and 1
            performance30d1: stock1.changePercent * 1.5,
            performance30d2: stock2.changePercent * 1.5,
          });
        }
      }
    } catch (err) {
      setError("Failed to compare stocks. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol1 && symbol2 && symbol1 !== symbol2) {
      handleCompare();
    }
  }, [symbol1, symbol2]);

  const getCorrelationColor = (corr: number) => {
    if (corr >= 0.7) return "text-chart-green";
    if (corr >= 0.3) return "text-chart-blue";
    if (corr >= -0.3) return "text-muted-foreground";
    if (corr >= -0.7) return "text-chart-orange";
    return "text-chart-red";
  };

  const getCorrelationLabel = (corr: number) => {
    if (corr >= 0.7) return "Strong Positive";
    if (corr >= 0.3) return "Moderate Positive";
    if (corr >= -0.3) return "Weak/No Correlation";
    if (corr >= -0.7) return "Moderate Negative";
    return "Strong Negative";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Compare Stocks</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Analyze correlation and performance between two stocks
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Stock Selection */}
        <div className="p-5 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stock 1
              </label>
              <select
                value={symbol1}
                onChange={(e) => setSymbol1(e.target.value)}
                className="w-full bg-secondary text-foreground text-sm px-3 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {companies.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name} ({c.symbol.replace(".NS", "")})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stock 2
              </label>
              <select
                value={symbol2}
                onChange={(e) => setSymbol2(e.target.value)}
                className="w-full bg-secondary text-foreground text-sm px-3 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {companies.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name} ({c.symbol.replace(".NS", "")})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-chart-red/10 border border-chart-red/30 rounded-lg">
              <p className="text-sm text-chart-red">{error}</p>
            </div>
          )}
        </div>

        {/* Comparison Results */}
        {loading && (
          <div className="p-10 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground mt-3">Comparing stocks...</p>
          </div>
        )}

        {!loading && compareData && (
          <div className="p-5 space-y-5">
            {/* Price Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stock 1 */}
              <div className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {compareData.symbol1.replace(".NS", "")}
                    </p>
                    <h3 className="text-lg font-bold text-foreground">
                      {compareData.name1}
                    </h3>
                  </div>
                  {compareData.changePercent1 >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-chart-green" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-chart-red" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <span className="text-lg font-semibold text-foreground">
                      {fmt(compareData.price1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Today's Change</span>
                    <span
                      className={`text-sm font-medium ${
                        compareData.changePercent1 >= 0 ? "text-chart-green" : "text-chart-red"
                      }`}
                    >
                      {compareData.changePercent1 >= 0 ? "+" : ""}
                      {compareData.changePercent1.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">30-Day Performance</span>
                    <span
                      className={`text-sm font-medium ${
                        compareData.performance30d1 >= 0 ? "text-chart-green" : "text-chart-red"
                      }`}
                    >
                      {compareData.performance30d1 >= 0 ? "+" : ""}
                      {compareData.performance30d1.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock 2 */}
              <div className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {compareData.symbol2.replace(".NS", "")}
                    </p>
                    <h3 className="text-lg font-bold text-foreground">
                      {compareData.name2}
                    </h3>
                  </div>
                  {compareData.changePercent2 >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-chart-green" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-chart-red" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <span className="text-lg font-semibold text-foreground">
                      {fmt(compareData.price2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Today's Change</span>
                    <span
                      className={`text-sm font-medium ${
                        compareData.changePercent2 >= 0 ? "text-chart-green" : "text-chart-red"
                      }`}
                    >
                      {compareData.changePercent2 >= 0 ? "+" : ""}
                      {compareData.changePercent2.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">30-Day Performance</span>
                    <span
                      className={`text-sm font-medium ${
                        compareData.performance30d2 >= 0 ? "text-chart-green" : "text-chart-red"
                      }`}
                    >
                      {compareData.performance30d2 >= 0 ? "+" : ""}
                      {compareData.performance30d2.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Correlation Analysis */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5" /> Correlation Analysis
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Correlation Coefficient</p>
                  <p className={`text-3xl font-bold ${getCorrelationColor(compareData.correlation)}`}>
                    {compareData.correlation.toFixed(4)}
                  </p>
                  <p className={`text-sm font-medium mt-1 ${getCorrelationColor(compareData.correlation)}`}>
                    {getCorrelationLabel(compareData.correlation)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-2">Interpretation</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {compareData.correlation >= 0.7 && (
                      <p>✓ Stocks move together strongly</p>
                    )}
                    {compareData.correlation >= 0.3 && compareData.correlation < 0.7 && (
                      <p>✓ Moderate positive relationship</p>
                    )}
                    {compareData.correlation >= -0.3 && compareData.correlation < 0.3 && (
                      <p>✓ Independent movement</p>
                    )}
                    {compareData.correlation < -0.3 && (
                      <p>✓ Stocks move in opposite directions</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Correlation Scale */}
              <div className="mt-4">
                <div className="h-2 rounded-full bg-gradient-to-r from-chart-red via-muted to-chart-green"></div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>-1.0</span>
                  <span>0.0</span>
                  <span>+1.0</span>
                </div>
              </div>
            </div>

            {/* Performance Comparison Chart */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={[
                    { name: "Today", stock1: 0, stock2: 0 },
                    {
                      name: "30 Days",
                      stock1: compareData.performance30d1,
                      stock2: compareData.performance30d2,
                    },
                  ]}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(220,18%,10%)",
                      border: "1px solid hsl(220,14%,18%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value.toFixed(2)}%`, ""]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px" }}
                    formatter={(value) =>
                      value === "stock1"
                        ? compareData.name1
                        : compareData.name2
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="stock1"
                    stroke="hsl(200,80%,50%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="stock2"
                    stroke="hsl(30,90%,55%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Investment Insight */}
            <div className="glass rounded-xl p-5 bg-primary/5 border-primary/20">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                💡 Portfolio Diversification Insight
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {Math.abs(compareData.correlation) < 0.3
                  ? "These stocks have low correlation, making them good candidates for portfolio diversification. They tend to move independently, which can help reduce overall portfolio risk."
                  : compareData.correlation > 0.7
                  ? "These stocks are highly correlated and tend to move together. Consider diversifying with stocks from different sectors to reduce portfolio risk."
                  : compareData.correlation < -0.7
                  ? "These stocks have strong negative correlation, moving in opposite directions. This can provide natural hedging in your portfolio."
                  : "These stocks show moderate correlation. They may provide some diversification benefits while still being influenced by similar market factors."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
