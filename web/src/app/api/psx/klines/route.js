// PSX Terminal API - Get K-line/candlestick data for trading charts
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const symbol = url.searchParams.get('symbol') || 'HUBC';
    const timeframe = url.searchParams.get('timeframe') || '1h';
    const limit = url.searchParams.get('limit') || '50';

    const response = await fetch(`https://psxterminal.com/api/klines/${symbol}/${timeframe}?limit=${limit}`, {
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
      // Transform PSX data to our chart format
      const chartData = data.data.map((item, index) => {
        const date = new Date(item.timestamp);
        let timeLabel;
        
        switch (timeframe) {
          case '1m':
          case '5m':
          case '15m':
            timeLabel = date.toLocaleTimeString('en-PK', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            break;
          case '1h':
            timeLabel = date.toLocaleTimeString('en-PK', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            break;
          case '1d':
            timeLabel = date.toLocaleDateString('en-PK', { 
              month: 'short', 
              day: 'numeric' 
            });
            break;
          default:
            timeLabel = `${index + 1}`;
        }

        return {
          time: timeLabel,
          value: Math.round(item.close),
          volume: item.volume,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          timestamp: item.timestamp
        };
      });

      return Response.json({
        success: true,
        data: chartData,
        symbol: data.symbol,
        timeframe: data.timeframe,
        count: data.count,
        timestamp: Date.now()
      });
    }

    throw new Error('Invalid response from PSX API');

  } catch (error) {
    console.error('Error fetching PSX K-line data:', error);
    
    // Generate fallback chart data
    const symbol = new URL(request.url).searchParams.get('symbol') || 'KSE100';
    const timeframe = new URL(request.url).searchParams.get('timeframe') || '1h';
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '50');
    
    const baseValue = symbol === 'KSE100' ? 45000 : Math.floor(Math.random() * 500) + 100;
    const fallbackData = [];
    
    for (let i = 0; i < limit; i++) {
      const variance = (Math.random() - 0.5) * (baseValue * 0.05);
      const value = Math.round(baseValue + variance + Math.sin(i * 0.1) * (baseValue * 0.01));
      
      let timeLabel;
      const now = new Date();
      const itemTime = new Date(now.getTime() - (limit - i) * getTimeframeMs(timeframe));
      
      switch (timeframe) {
        case '1m':
        case '5m':
        case '15m':
        case '1h':
          timeLabel = itemTime.toLocaleTimeString('en-PK', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          break;
        case '1d':
          timeLabel = itemTime.toLocaleDateString('en-PK', { 
            month: 'short', 
            day: 'numeric' 
          });
          break;
        default:
          timeLabel = `${i + 1}`;
      }

      fallbackData.push({
        time: timeLabel,
        value: value,
        volume: Math.floor(Math.random() * 1000000),
        open: value + Math.random() * 10 - 5,
        high: value + Math.random() * 15,
        low: value - Math.random() * 15,
        close: value,
        timestamp: itemTime.getTime()
      });
    }

    return Response.json({
      success: true,
      data: fallbackData,
      symbol: symbol,
      timeframe: timeframe,
      count: fallbackData.length,
      timestamp: Date.now(),
      fallback: true
    });
  }
}

function getTimeframeMs(timeframe) {
  const timeframes = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000
  };
  return timeframes[timeframe] || timeframes['1h'];
}