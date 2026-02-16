const getTwitchAccessToken = async () => {
  try {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
      {
        method: 'POST'
      }
    );

    const tokenData = await response.json();

    if (!response.ok) {
      console.error('Error obteniendo token de Twitch:', tokenData);
      return null;
    }

    return tokenData.access_token;

  } catch (error) {
    console.error('Error conectando con Twitch:', error.message);
    return null;
  }
};

const executeIgdbQuery = async (queryBody) => {
  try {
    const accessToken = await getTwitchAccessToken();

    if (!accessToken) {
      console.error('No se pudo obtener access token');
      return [];
    }

    const response = await fetch(process.env.IGDB_BASE_URL, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain'
      },
      body: queryBody
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error en consulta IGDB:', data);
      return [];
    }

    return data;

  } catch (error) {
    console.error('Error ejecutando query IGDB:', error.message);
    return [];
  }
};

module.exports = {
  getTwitchAccessToken,
  executeIgdbQuery
};
