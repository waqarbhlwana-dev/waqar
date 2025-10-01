// PSX Terminal API - Get all available symbols
export async function GET(request) {
  try {
    const response = await fetch('https://psxterminal.com/api/symbols', {
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
    
    return Response.json({
      success: true,
      symbols: data.data || [],
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error fetching PSX symbols:', error);
    
    // Fallback to mock data if API fails
    const fallbackSymbols = [
      "KSE100", "KTM", "HBL", "ENGRO", "LUCK", "OGDC", "PPL", "SSGC", "TRG",
      "UBL", "MCB", "ABL", "FFC", "MARI", "HUBC", "POL", "NESTLE", "BAHL"
    ];
    
    return Response.json({
      success: true,
      symbols: fallbackSymbols,
      timestamp: Date.now(),
      fallback: true
    });
  }
}