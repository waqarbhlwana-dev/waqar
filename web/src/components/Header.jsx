import {
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Fetch real PSX market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/api/psx/ticker?symbols=KTM,HBL,ENGRO,LUCK,OGDC,PPL,SSGC,TRG,UBL,MCB,ABL,FFC",
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setMarketData(result.data);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (error) {
        console.error("Error fetching market data:", error);

        // Fallback data if API fails
        const fallbackData = [
          {
            symbol: "KTM",
            price: "425.50",
            change: "+2.15%",
            isPositive: true,
          },
          {
            symbol: "HBL",
            price: "89.75",
            change: "-0.85%",
            isPositive: false,
          },
          {
            symbol: "ENGRO",
            price: "320.25",
            change: "+1.45%",
            isPositive: true,
          },
          {
            symbol: "LUCK",
            price: "780.00",
            change: "+3.20%",
            isPositive: true,
          },
          {
            symbol: "OGDC",
            price: "95.30",
            change: "-1.25%",
            isPositive: false,
          },
          { symbol: "PPL", price: "85.60", change: "+0.75%", isPositive: true },
          {
            symbol: "SSGC",
            price: "18.45",
            change: "+2.10%",
            isPositive: true,
          },
          {
            symbol: "TRG",
            price: "45.80",
            change: "-0.95%",
            isPositive: false,
          },
        ];
        setMarketData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchMarketData();

    // Set up real-time updates every 10 seconds
    const interval = setInterval(fetchMarketData, 10000);

    return () => clearInterval(interval);
  }, []);

  // Search functionality
  const performSearch = async (query) => {
    if (!query || query.length < 1) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(
        `/api/psx/search?q=${encodeURIComponent(query)}&limit=8`,
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSearchResults(result.data);
          setShowSearchResults(true);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  const handleSearchResultClick = (symbol) => {
    setSearchQuery(symbol);
    setShowSearchResults(false);
    // You can add navigation logic here to show the symbol's details
    console.log(`Selected symbol: ${symbol}`);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white dark:bg-[#1E1E1E] border-b border-[#E8EAEE] dark:border-[#333333] sticky top-0 z-50">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left cluster - Logo and Navigation */}
          <div className="flex items-center">
            {/* Brand logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF8200] to-[#FF9C14] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PSX</span>
                </div>
                <span className="font-instrument-sans text-xl font-bold text-[#111827] dark:text-[#E0E0E0]">
                  PSX Capitals
                </span>
              </div>
            </div>

            {/* Primary navigation - desktop */}
            <nav className="hidden lg:flex items-center ml-8 space-x-8">
              <a
                href="#"
                className="font-instrument-sans text-base font-medium text-[#FF7A00] dark:text-[#FF8F1F] underline decoration-2 underline-offset-4 decoration-[#FF7A00] dark:decoration-[#FF8F1F] hover:text-[#E56B00] dark:hover:text-[#FF7A00] transition-colors duration-200"
              >
                Markets
              </a>
              <a
                href="#"
                className="font-instrument-sans text-base text-[#6E728B] dark:text-[#A0A0A0] hover:text-[#1B1F29] dark:hover:text-[#E0E0E0] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
              >
                Trading
              </a>
              <a
                href="#"
                className="font-instrument-sans text-base text-[#6E728B] dark:text-[#A0A0A0] hover:text-[#1B1F29] dark:hover:text-[#E0E0E0] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
              >
                Analysis
              </a>
              <a
                href="#"
                className="font-instrument-sans text-base text-[#6E728B] dark:text-[#A0A0A0] hover:text-[#1B1F29] dark:hover:text-[#E0E0E0] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
              >
                News
              </a>
            </nav>

            {/* Mobile hamburger menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden ml-3 sm:ml-5 p-2 hover:bg-[#F8FAFC] dark:hover:bg-[#333333] active:bg-[#F1F5F9] dark:active:bg-[#404040] transition-colors duration-200 rounded-md"
              aria-label="Toggle menu"
            >
              <div
                className={`w-6 h-0.5 bg-[#2E3344] dark:bg-[#E0E0E0] mb-1 transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-[#2E3344] dark:bg-[#E0E0E0] mb-1 transition-opacity duration-200 ${isMobileMenuOpen ? "opacity-0" : ""}`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-[#2E3344] dark:bg-[#E0E0E0] transition-transform duration-200 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              ></div>
            </button>
          </div>

          {/* Right cluster - Search, Notification, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Search component with real-time results */}
            <div className="relative hidden sm:block" ref={searchContainerRef}>
              <div className="flex items-center bg-[#F8FAFC] dark:bg-[#333333] border border-[#E1E4EA] dark:border-[#404040] rounded-full px-4 py-2 w-48 md:w-60 lg:w-72 focus-within:border-[#FF7A00] dark:focus-within:border-[#FF8F1F] focus-within:bg-white dark:focus-within:bg-[#404040] transition-all duration-200">
                <Search className="w-5 h-5 text-[#6E728B] dark:text-[#A0A0A0] mr-3" />
                <input
                  type="text"
                  placeholder="Search PSX stocks..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="bg-transparent outline-none text-base font-instrument-sans text-[#2E3344] dark:text-[#E0E0E0] placeholder-[#6E728B] dark:placeholder-[#A0A0A0] w-full"
                />
                {isSearching && (
                  <div className="animate-spin w-4 h-4 border-2 border-[#FF7A00] border-t-transparent rounded-full"></div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1E1E1E] border border-[#E1E4EA] dark:border-[#333333] rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      <div className="text-xs font-instrument-sans text-[#6B7280] dark:text-[#A0A0A0] mb-2 px-2">
                        Live PSX Search Results
                      </div>
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchResultClick(result.symbol)}
                          className="w-full text-left p-3 hover:bg-[#F8FAFC] dark:hover:bg-[#333333] rounded-lg transition-colors duration-200 border-b border-[#F1F5F9] dark:border-[#333333] last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-instrument-sans font-semibold text-[#111827] dark:text-[#E0E0E0]">
                                {result.symbol}
                              </div>
                              <div className="text-xs font-instrument-sans text-[#6B7280] dark:text-[#A0A0A0]">
                                {result.market} • Vol:{" "}
                                {result.volume
                                  ? result.volume.toLocaleString("en-PK")
                                  : "--"}
                              </div>
                            </div>
                            <div className="text-right">
                              {result.price && (
                                <>
                                  <div className="font-instrument-sans font-medium text-[#111827] dark:text-[#E0E0E0]">
                                    {result.price.toFixed(2)}
                                  </div>
                                  <div
                                    className={`flex items-center gap-1 text-xs font-instrument-sans ${
                                      result.change >= 0
                                        ? "text-[#22C55E]"
                                        : "text-[#EF4444]"
                                    }`}
                                  >
                                    {result.change >= 0 ? (
                                      <TrendingUp className="w-3 h-3" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3" />
                                    )}
                                    {result.changePercent?.toFixed(2)}%
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <div className="text-sm font-instrument-sans text-[#6B7280] dark:text-[#A0A0A0]">
                        {searchQuery
                          ? "No symbols found"
                          : "Start typing to search PSX stocks..."}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile search button */}
            <button
              className="sm:hidden w-10 h-10 rounded-full border border-[#E1E4EA] dark:border-[#404040] bg-white dark:bg-[#333333] flex items-center justify-center hover:border-[#FF7A00] dark:hover:border-[#FF8F1F] hover:bg-[#FFF7F0] dark:hover:bg-[#404040] focus:border-[#FF7A00] dark:focus:border-[#FF8F1F] focus:outline-none focus:ring-2 focus:ring-[#FF7A00] dark:focus:ring-[#FF8F1F] focus:ring-offset-2 active:bg-[#FFEBE0] dark:active:bg-[#555555] transition-all duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#2E3344] dark:text-[#E0E0E0]" />
            </button>

            {/* Divider */}
            <div className="hidden lg:block w-px h-6 bg-[#E1E4EA] dark:bg-[#404040]"></div>

            {/* Notification button */}
            <button
              className="w-10 h-10 rounded-full border border-[#E1E4EA] dark:border-[#404040] bg-white dark:bg-[#333333] flex items-center justify-center hover:border-[#FF7A00] dark:hover:border-[#FF8F1F] hover:bg-[#FFF7F0] dark:hover:bg-[#404040] focus:border-[#FF7A00] dark:focus:border-[#FF8F1F] focus:outline-none focus:ring-2 focus:ring-[#FF7A00] dark:focus:ring-[#FF8F1F] focus:ring-offset-2 active:bg-[#FFEBE0] dark:active:bg-[#555555] transition-all duration-200"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5 text-[#2E3344] dark:text-[#E0E0E0]" />
            </button>

            {/* Profile dropdown trigger */}
            <button className="flex items-center space-x-2 sm:space-x-3 hover:bg-[#F8FAFC] dark:hover:bg-[#333333] active:bg-[#F1F5F9] dark:active:bg-[#404040] transition-colors duration-200 px-2 py-1 rounded-md group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF8200] to-[#FF9C14] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">U</span>
              </div>
              <span className="hidden sm:block font-instrument-sans text-base font-medium text-[#2E3344] dark:text-[#E0E0E0] group-hover:text-[#FF7A00] dark:group-hover:text-[#FF8F1F] transition-colors duration-200">
                Trader
              </span>
              <ChevronDown className="w-4 h-4 text-[#2E3344] dark:text-[#E0E0E0] hidden sm:block group-hover:text-[#FF7A00] dark:group-hover:text-[#FF8F1F] transition-colors duration-200" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#1E1E1E] border-t border-[#E8EAEE] dark:border-[#333333]">
            <nav className="px-4 py-4 space-y-4">
              {/* Mobile Search Bar */}
              <div className="sm:hidden mb-4">
                <div className="flex items-center bg-[#F8FAFC] dark:bg-[#333333] border border-[#E1E4EA] dark:border-[#404040] rounded-full px-4 py-3 focus-within:border-[#FF7A00] dark:focus-within:border-[#FF8F1F] focus-within:bg-white dark:focus-within:bg-[#404040] transition-all duration-200">
                  <Search className="w-5 h-5 text-[#6E728B] dark:text-[#A0A0A0] mr-3" />
                  <input
                    type="text"
                    placeholder="Search PSX stocks..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-transparent outline-none text-base font-instrument-sans text-[#2E3344] dark:text-[#E0E0E0] placeholder-[#6E728B] dark:placeholder-[#A0A0A0] w-full"
                  />
                </div>

                {/* Mobile Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="mt-2 bg-[#F8FAFC] dark:bg-[#333333] rounded-lg p-2 max-h-64 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleSearchResultClick(result.symbol);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left p-2 hover:bg-white dark:hover:bg-[#404040] rounded transition-colors duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-instrument-sans font-medium text-[#111827] dark:text-[#E0E0E0]">
                            {result.symbol}
                          </span>
                          {result.price && (
                            <span
                              className={`text-sm font-instrument-sans ${
                                result.change >= 0
                                  ? "text-[#22C55E]"
                                  : "text-[#EF4444]"
                              }`}
                            >
                              {result.price.toFixed(2)} (
                              {result.changePercent?.toFixed(2)}%)
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-instrument-sans text-lg font-medium text-[#FF7A00] dark:text-[#FF8F1F] hover:text-[#E56B00] dark:hover:text-[#FF7A00] transition-colors duration-200 py-2 border-b border-[#F1F5F9] dark:border-[#333333]"
              >
                Markets
              </a>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-instrument-sans text-lg text-[#6E728B] dark:text-[#A0A0A0] hover:text-[#1B1F29] dark:hover:text-[#E0E0E0] transition-colors duration-200 py-2 border-b border-[#F1F5F9] dark:border-[#333333]"
              >
                Trading
              </a>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-instrument-sans text-lg text-[#6E728B] dark:text-[#A0A0A0] hover:text-[#1B1F29] dark:hover:text-[#E0E0E0] transition-colors duration-200 py-2 border-b border-[#F1F5F9] dark:border-[#333333]"
              >
                Analysis
              </a>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-instrument-sans text-lg text-[#6E728B] dark:text-[#A0A0A0] hover:text-[#1B1F29] dark:hover:text-[#E0E0E0] transition-colors duration-200 py-2"
              >
                News
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Stock Market Ticker Marquee */}
      <div className="bg-[#F8FAFC] dark:bg-[#333333] border-b border-[#E8EAEE] dark:border-[#404040] py-2 overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {isLoading ? (
            // Loading state
            <div className="flex items-center space-x-2 mx-6">
              <span className="font-instrument-sans text-sm text-[#6B7280] dark:text-[#A0A0A0]">
                Loading PSX data...
              </span>
            </div>
          ) : (
            <>
              {marketData.map((stock, index) => (
                <div key={index} className="flex items-center space-x-2 mx-6">
                  <span className="font-instrument-sans text-sm font-semibold text-[#111827] dark:text-[#E0E0E0]">
                    {stock.symbol}
                  </span>
                  <span className="font-instrument-sans text-sm text-[#374151] dark:text-[#A0A0A0]">
                    {stock.price}
                  </span>
                  <span
                    className={`font-instrument-sans text-sm font-medium ${
                      stock.isPositive ? "text-[#22C55E]" : "text-[#EF4444]"
                    }`}
                  >
                    {stock.change}
                  </span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {marketData.map((stock, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="flex items-center space-x-2 mx-6"
                >
                  <span className="font-instrument-sans text-sm font-semibold text-[#111827] dark:text-[#E0E0E0]">
                    {stock.symbol}
                  </span>
                  <span className="font-instrument-sans text-sm text-[#374151] dark:text-[#A0A0A0]">
                    {stock.price}
                  </span>
                  <span
                    className={`font-instrument-sans text-sm font-medium ${
                      stock.isPositive ? "text-[#22C55E]" : "text-[#EF4444]"
                    }`}
                  >
                    {stock.change}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Google Font - Instrument Sans and Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap');
        .font-instrument-sans {
          font-family: 'Instrument Sans', sans-serif;
          letter-spacing: -0.025em;
          line-height: 1.25;
        }
        .font-poppins {
          font-family: 'Poppins', 'Inter', sans-serif;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </>
  );
}
