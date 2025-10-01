import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Activity,
} from "lucide-react";

export default function TradingGraph() {
  const [timeframe, setTimeframe] = useState("1h");
  const [selectedStock, setSelectedStock] = useState("HUBC");
  const [chartData, setChartData] = useState([]);
  const [marketStats, setMarketStats] = useState({
    currentValue: "0.00",
    change: "+0.00",
    changePercent: "+0.00%",
    isPositive: true,
  });
  const [fundamentals, setFundamentals] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available symbols
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await fetch("/api/psx/symbols");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.symbols) {
            // Filter and format symbols for dropdown
            const majorSymbols = result.symbols.filter((symbol) =>
              [
                "HUBC",
                "KTM",
                "HBL",
                "ENGRO",
                "LUCK",
                "UBL",
                "MCB",
                "ABL",
                "FFC",
                "MARI",
              ].includes(symbol),
            );
            setSymbols(
              majorSymbols.length > 0
                ? majorSymbols
                : ["HUBC", "KTM", "HBL", "ENGRO", "LUCK"],
            );
          }
        }
      } catch (error) {
        console.error("Error fetching symbols:", error);
        setSymbols(["HUBC", "KTM", "HBL", "ENGRO", "LUCK"]);
      }
    };

    fetchSymbols();
  }, []);

  // Fetch chart data and fundamentals
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch K-line data
        const chartResponse = await fetch(
          `/api/psx/klines?symbol=${selectedStock}&timeframe=${timeframe}&limit=50`,
        );
        if (chartResponse.ok) {
          const chartResult = await chartResponse.json();
          if (chartResult.success && chartResult.data) {
            setChartData(chartResult.data);

            // Update market stats from latest data point
            const latestData = chartResult.data[chartResult.data.length - 1];
            if (latestData && chartResult.data.length > 1) {
              const previousData =
                chartResult.data[chartResult.data.length - 2];
              const change = latestData.value - previousData.value;
              const changePercent = (change / previousData.value) * 100;

              setMarketStats({
                currentValue: latestData.value.toLocaleString("en-PK", {
                  minimumFractionDigits: 2,
                }),
                change:
                  change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2),
                changePercent:
                  change >= 0
                    ? `+${changePercent.toFixed(2)}%`
                    : `${changePercent.toFixed(2)}%`,
                isPositive: change >= 0,
              });
            }
          }
        }

        // Fetch fundamentals data
        const fundResponse = await fetch(
          `/api/psx/fundamentals?symbol=${selectedStock}`,
        );
        if (fundResponse.ok) {
          const fundResult = await fundResponse.json();
          if (fundResult.success && fundResult.data) {
            setFundamentals(fundResult.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedStock) {
      fetchData();

      // Set up real-time updates every 30 seconds for 1h and shorter timeframes
      const shouldUpdate = ["1m", "5m", "15m", "1h"].includes(timeframe);
      if (shouldUpdate) {
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
      }
    }
  }, [selectedStock, timeframe]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#333333] rounded-lg shadow-lg p-3">
          <p className="font-poppins text-sm text-[#6B7280] dark:text-[#A0A0A0] mb-1">
            {label}
          </p>
          <p className="font-poppins text-lg font-semibold text-[#111827] dark:text-[#E0E0E0]">
            {payload[0].value.toLocaleString("en-PK")}
          </p>
          <p className="font-poppins text-xs text-[#6B7280] dark:text-[#A0A0A0]">
            Volume: {payload[0].payload.volume?.toLocaleString("en-PK")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8">
      {/* Chart Header */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-t-lg shadow-sm border border-gray-200 dark:border-[#333333] p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          {/* Stock Selection and Stats */}
          <div className="mb-4 lg:mb-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="bg-[#F8FAFC] dark:bg-[#333333] border border-[#E1E4EA] dark:border-[#404040] rounded-lg px-4 py-2 font-poppins text-[#111827] dark:text-[#E0E0E0] focus:border-[#FF7A00] dark:focus:border-[#FF8F1F] focus:outline-none"
              >
                {symbols.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#22C55E]" />
                <span className="font-poppins text-sm text-[#22C55E] font-medium">
                  Live PSX
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold font-poppins text-[#111827] dark:text-[#E0E0E0]">
                {isLoading ? "Loading..." : marketStats.currentValue}
              </h2>
              <div className="flex items-center gap-2">
                {marketStats.isPositive ? (
                  <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-[#EF4444]" />
                )}
                <span
                  className={`font-poppins text-lg font-semibold ${
                    marketStats.isPositive ? "text-[#22C55E]" : "text-[#EF4444]"
                  }`}
                >
                  {marketStats.change} ({marketStats.changePercent})
                </span>
              </div>
            </div>
          </div>

          {/* Time Frame Buttons */}
          <div className="flex gap-2">
            {["1m", "5m", "15m", "1h", "1d"].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg font-poppins text-sm font-medium transition-all duration-200 ${
                  timeframe === period
                    ? "bg-[#FF8200] dark:bg-[#FF8F1F] text-white"
                    : "bg-[#F8FAFC] dark:bg-[#333333] text-[#6B7280] dark:text-[#A0A0A0] hover:bg-[#F1F5F9] dark:hover:bg-[#404040]"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#F8FAFC] dark:bg-[#333333] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-poppins text-sm text-[#6B7280] dark:text-[#A0A0A0]">
                P/E Ratio
              </span>
              <TrendingUp className="w-4 h-4 text-[#22C55E]" />
            </div>
            <span className="font-poppins text-lg font-semibold text-[#111827] dark:text-[#E0E0E0]">
              {fundamentals ? fundamentals.peRatio?.toFixed(2) : "--"}
            </span>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-[#333333] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-poppins text-sm text-[#6B7280] dark:text-[#A0A0A0]">
                Div Yield
              </span>
              <TrendingDown className="w-4 h-4 text-[#EF4444]" />
            </div>
            <span className="font-poppins text-lg font-semibold text-[#111827] dark:text-[#E0E0E0]">
              {fundamentals
                ? `${fundamentals.dividendYield?.toFixed(2)}%`
                : "--"}
            </span>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-[#333333] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-poppins text-sm text-[#6B7280] dark:text-[#A0A0A0]">
                Market Cap
              </span>
              <BarChart3 className="w-4 h-4 text-[#6B7280] dark:text-[#A0A0A0]" />
            </div>
            <span className="font-poppins text-lg font-semibold text-[#111827] dark:text-[#E0E0E0]">
              {fundamentals ? fundamentals.marketCap : "--"}
            </span>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-[#333333] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-poppins text-sm text-[#6B7280] dark:text-[#A0A0A0]">
                Year Change
              </span>
              <Calendar className="w-4 h-4 text-[#6B7280] dark:text-[#A0A0A0]" />
            </div>
            <span
              className={`font-poppins text-lg font-semibold ${
                fundamentals && fundamentals.yearChange >= 0
                  ? "text-[#22C55E]"
                  : "text-[#EF4444]"
              }`}
            >
              {fundamentals ? `${fundamentals.yearChange?.toFixed(2)}%` : "--"}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-b-lg shadow-sm border-l border-r border-b border-gray-200 dark:border-[#333333] p-6">
        <div className="h-96 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-[#6B7280] dark:text-[#A0A0A0] font-poppins">
                Loading PSX chart data...
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8200" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF8200" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="time"
                  stroke="#6B7280"
                  fontSize={12}
                  fontFamily="Poppins"
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  fontFamily="Poppins"
                  tickFormatter={(value) => value.toLocaleString("en-PK")}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FF8200"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#FF8200",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Chart Footer */}
        <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#333333]">
          <div className="flex items-center justify-between text-sm font-poppins text-[#6B7280] dark:text-[#A0A0A0]">
            <span>Last updated: {new Date().toLocaleTimeString("en-PK")}</span>
            <span>Data provided by PSX Terminal API</span>
          </div>
        </div>
      </div>

      {/* Poppins Font */}
      <style jsx global>{`
        .font-poppins {
          font-family: 'Poppins', 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
