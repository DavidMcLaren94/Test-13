export default async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = 'WO3OFxZcv2dmDxzRbRytePgGmtWsA04U';
  const url = `https://api.solcast.com.au/data/live/radiation_and_weather?latitude=${lat}&longitude=${lon}&hours=168&output_parameters=ghi,dni,air_temp&period=PT30M&format=json&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const estimatedActuals = data.estimated_actuals || [];
    let totalGHI = 0;
    let count = 0;

    estimatedActuals.forEach(entry => {
      if (!isNaN(entry.ghi)) {
        totalGHI += entry.ghi;
        count++;
      }
    });

    const dailyRadiation = totalGHI / count;
    res.status(200).json({ dailyRadiation });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
