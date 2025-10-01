// PSX Terminal API - Get comprehensive market data
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'REG'; // REG, IDX, BNB, etc.
    const limit = url.searchParams.get('limit') || '50';

    // Get market statistics
    const statsResponse = await fetch(`https://psxterminal.com/api/stats/${type}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PSX-Capitals-App/1.0'
      }
    });

    let marketStats = null;
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      if (statsData.success) {
        marketStats = statsData.data;
      }
    }

    // Get symbols for the market type
    const symbolsResponse = await fetch('https://psxterminal.com/api/symbols', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PSX-Capitals-App/1.0'
      }
    });

    let symbols = [];
    if (symbolsResponse.ok) {
      const symbolsData = await symbolsResponse.json();
      if (symbolsData.success && symbolsData.data) {
        symbols = symbolsData.data.slice(0, parseInt(limit));
      }
    }

    // Get real-time data for top symbols
    const topSymbols = symbols.slice(0, 20); // Limit to avoid API rate limits
    const marketData = await Promise.all(
      topSymbols.map(async (symbol) => {
        try {
          const tickerResponse = await fetch(`https://psxterminal.com/api/ticks/${type}/${symbol}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'PSX-Capitals-App/1.0'
            }
          });

          if (tickerResponse.ok) {
            const tickerData = await tickerResponse.json();
            if (tickerData.success && tickerData.data) {
              return {
                symbol: tickerData.data.symbol,
                price: tickerData.data.price,
                change: tickerData.data.change,
                changePercent: tickerData.data.changePercent,
                volume: tickerData.data.volume,
                trades: tickerData.data.trades,
                value: tickerData.data.value,
                high: tickerData.data.high,
                low: tickerData.data.low,
                market: tickerData.data.market,
                marketState: tickerData.data.st,
                timestamp: tickerData.data.timestamp
              };
            }
          }
          return null;
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
          return null;
        }
      })
    );

    const validMarketData = marketData.filter(item => item !== null);

    return Response.json({
      success: true,
      data: {
        stats: marketStats,
        stocks: validMarketData,
        symbols: symbols
      },
      type: type,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error fetching PSX market data:', error);
    
    // Fallback data
    const fallbackData = {
      stats: {
        totalVolume: 1000000000,
        totalValue: 50000000000,
        totalTrades: 15000,
        gainers: 250,
        losers: 200,
        unchanged: 50
      },
      stocks: [
        {
          symbol: "KSE100",
          price: 45123.45,
          change: 234.56,
          changePercent: 0.52,
          volume: 500000000,
          trades: 8500,
          value: 25000000000,
          high: 45200,
          low: 44900,
          market: "IDX",
          marketState: "FALLBACK",
          timestamp: Date.now()
        },
        {
          symbol: "HBL",
          price: 89.75,
          change: -0.85,
          changePercent: -0.94,
          volume: 12500000,
          trades: 3200,
          value: 1120000000,
          high: 92.00,
          low: 89.50,
          market: "REG",
          marketState: "FALLBACK",
          timestamp: Date.now()
        }
      ],
      symbols: ["KSE100", "KTM", "HBL", "ENGRO", "LUCK", "OGDC", "PPL"]
    };

    return Response.json({
      success: true,
      data: fallbackData,
      type: 'REG',
      timestamp: Date.now(),
      fallback: true
    });
  }
}