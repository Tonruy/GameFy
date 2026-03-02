

// Token from Amazon/Twitch OAuth :
// OAuth 2.0 grant_type=client_credentials used when its an app and not an user. 
// Backend <-> Backend
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
      console.error('Error obtaining Twitch token:', tokenData);
      return null;
    }

    return tokenData.access_token; // -> IGDB Client-ID

  } catch (error) {
    console.error('Error making the connection with Twitch', error.message);
    return null;
  }
};

// Using in a lot of functions so its best practices to separate the query and call it in the functions needed
const executeIgdbQuery = async (endpoint, queryBody) => {
  try {
    const accessToken = await getTwitchAccessToken();
    
    if (!accessToken) {
      console.error('Could not get access token');
      return [];
    }
    
    // Dinamic endpoint depending on what is searching (genres, platform...) // POST = fields on querys
    const response = await fetch(`${process.env.IGDB_BASE_URL}/${endpoint}`, {
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
      return [];
    }

    return data;

  } catch (error) {
    console.error('Error executing query on IGDB:', error.message);
    return [];
  }
};

module.exports = {
  getTwitchAccessToken,
  executeIgdbQuery
};

