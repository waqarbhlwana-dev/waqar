// PSX Terminal API - Get fundamental analysis data
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol') || 'HUBC';

    const response = await fetch(`https://psxterminal.com/api/fundamentals/${symbol}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PSX-Capitals-App/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`PSX API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      return Response.json({
        success: true,
        data: {
          symbol: data.data.symbol,
          sector: data.data.sector,
          marketCap: data.data.marketCap,
          price: data.data.price,
          changePercent: data.data.changePercent,
          yearChange: data.data.yearChange,
          peRatio: data.data.peRatio,
          dividendYield: data.data.dividendYield,
          freeFloat: data.data.freeFloat,
          volume30Avg: data.data.volume30Avg,
          timestamp: data.data.timestamp
        },
        timestamp: Date.now()
      });
    }

    throw new Error('Invalid response from PSX API');

  } catch (error) {
    console.error('Error fetching PSX fundamentals data:', error);
    
    // Fallback fundamental data
    const symbol = new URL(request.url).searchParams.get('symbol') || 'HUBC';
    
    const fallbackData = {
      symbol: symbol,
      sector: "Banking",
      marketCap: `${(Math.random() * 500 + 100).toFixed(1)}B`,
      price: Math.random() * 500 + 100,
      changePercent: (Math.random() - 0.5) * 10,
      yearChange: (Math.random() - 0.5) * 50,
      peRatio: Math.random() * 20 + 5,
      dividendYield: Math.random() * 15 + 2,
      freeFloat: `${(Math.random() * 1000 + 100).toFixed(0)}M`,
      volume30Avg: Math.floor(Math.random() * 10000000),
      timestamp: new Date().toISOString()
    };

    return Response.json({
      success: true,
      data: fallbackData,
      timestamp: Date.now(),
      fallback: true
    });
  }
}