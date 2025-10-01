// PSX Terminal API - Get real-time market data for ticker
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const symbols = url.searchParams.get('symbols') || 'KTM,HBL,ENGRO,LUCK,OGDC,PPL,SSGC,TRG';
    const symbolList = symbols.split(',');

    // Fetch data for multiple symbols
    const promises = symbolList.map(async (symbol) => {
      try {
        const response = await fetch(`https://psxterminal.com/api/ticks/REG/${symbol.trim()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'PSX-Capitals-App/1.0'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${symbol}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          return {
            symbol: data.data.symbol,
            price: data.data.price.toFixed(2),
            change: data.data.change >= 0 ? `+${data.data.changePercent.toFixed(2)}%` : `${data.data.changePercent.toFixed(2)}%`,
            isPositive: data.data.change >= 0,
            volume: data.data.volume,
            timestamp: data.data.timestamp
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const validResults = results.filter(result => result !== null);

    // If no real data, provide fallback
    if (validResults.length === 0) {
      const fallbackData = symbolList.map(symbol => ({
        symbol: symbol.trim(),
        price: (Math.random() * 1000 + 100).toFixed(2),
        change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(2)}%`,
        isPositive: Math.random() > 0.5,
        volume: Math.floor(Math.random() * 10000000),
        timestamp: Date.now()
      }));

      return Response.json({
        success: true,
        data: fallbackData,
        timestamp: Date.now(),
        fallback: true
      });
    }

    return Response.json({
      success: true,
      data: validResults,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error fetching PSX ticker data:', error);
    
    // Fallback data
    const fallbackData = [
      { symbol: "KTM", price: "425.50", change: "+2.15%", isPositive: true },
      { symbol: "HBL", price: "89.75", change: "-0.85%", isPositive: false },
      { symbol: "ENGRO", price: "320.25", change: "+1.45%", isPositive: true },
      { symbol: "LUCK", price: "780.00", change: "+3.20%", isPositive: true },
      { symbol: "OGDC", price: "95.30", change: "-1.25%", isPositive: false },
      { symbol: "PPL", price: "85.60", change: "+0.75%", isPositive: true },
      { symbol: "SSGC", price: "18.45", change: "+2.10%", isPositive: true },
      { symbol: "TRG", price: "45.80", change: "-0.95%", isPositive: false }
    ];

    return Response.json({
      success: true,
      data: fallbackData,
      timestamp: Date.now(),
      fallback: true
    });
  }
}